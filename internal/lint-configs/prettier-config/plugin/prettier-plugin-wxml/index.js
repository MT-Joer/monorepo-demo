
import { doc } from "prettier";
import prettierPluginMp from "prettier-plugin-mp";

const { group, hardline, indent, join,  softline  } = doc.builders;

const originalPrinter = prettierPluginMp.printers.wxml;

function printEndTag(path) {
    const node = path.getValue();
    return `</${node.name}>`;
}


function replaceLineWithSoftline(node) {
    if (!node || typeof node === "string") return node;
    if (Array.isArray(node)) return node.map(item => replaceLineWithSoftline(item));

    if (node.type === "line") {
        return softline;
    }

    if (node.contents) {
        return {
            ...node,
            contents: replaceLineWithSoftline(node.contents),
        };
    }

    return node;
}

function printMisc(path, opts) {
    const node = path.getValue();

    // Handle WXScript nodes
    if (node.type === "WXScript") {
        let result = "";

        // Print start tag manually
        if (node.startTag) {
            const isSelfClosing = !!node.startTag.selfClosing;
            result += `<${node.startTag.name}`;
            if (node.startTag.attributes && node.startTag.attributes.length > 0) {
                for (const attr of node.startTag.attributes) {
                    const normalized = attr.value === null
                        ? attr.key
                        : `${attr.key}=${normalizeAttrValueForWxmlQuotes(attr.value, opts)}`;
                    result += ` ${normalized}`;
                }
            }
            if (isSelfClosing) {
                result += " />";
                return result; // self-closing: no content, no end tag
            } else {
                result += ">";
            }
        }

        // Print content with proper JavaScript formatting
        if (node.value) {
            result += "\n";
            const jsCode = node.value.trim();
            const indentSize = typeof opts.wxsTabWidth === "number" ? opts.wxsTabWidth : (opts.tabWidth || 2);
            // 不再使用 Prettier 路径
            let formatted =  formatWxsByBabelCompat(jsCode, opts);
            if (typeof formatted === "string") {
                // Enforce preferred string quote style for simple literals only when formatted
                const useSingle = opts.wxsSingleQuote !== false;
                formatted = enforceWxsStringQuotes(formatted, useSingle);
            } else {
                try {
                    const snippet = jsCode.split("\n").slice(0, 5).join("\n");
                    console.error("[wxs] Unable to format. First lines:", snippet);
                } catch {}
                // 统一的失败处理：抛出错误以便上层保留原始内容，避免错误输出破坏结构
                throw new Error("Failed to parse/format <wxs> JavaScript");
            }
            const content = (formatted.endsWith("\n") ? formatted : `${formatted  }\n`);
            result += indentLines(content, indentSize);
        }

        // Print end tag manually
        if (node.endTag) {
            result += `</${node.endTag.name}>`;
        }

        return result;
    }

    throw new Error(`printMisc received unknown node type: ${node.type}. This is a bug in the printer.`);
}

function printCharData(path, opts, print) {
    const node = path.getValue();
    const { value } = node;
    if (!value) return "";
    if (value.trim() === "") {
    // Return whitespace as-is; element-level logic decides whether to keep it
        return value;
    }
    // Normalize inline template expressions
    const normalized = formatWxmlInterpolations(value, opts);
    // Do not trim() here to avoid silently removing significant leading/trailing spaces in text nodes
    return normalized;
}
// Helper: build doc for multi-line mustache printed text, or return null if not applicable
function buildMultiLineMustacheDocFromPrinted(printedText) {
    if (typeof printedText !== "string" || !printedText.includes("\n")) return null;
    const rawLines = printedText.split("\n").map((s) => s.trim());
    if (rawLines[0] !== "{{" || rawLines[rawLines.length - 1] !== "}}") return null;

    const innerLines = rawLines.slice(1, - 1);
    const simple = isSimpleMustacheIdentifier(innerLines);

    const contentDoc = [];
    for (let li = 1; li < rawLines.length - 1; li++) {
        contentDoc.push(hardline, rawLines[li]);
    }

    if (simple) {
    // Simple identifier like "title": content aligns with '{{', '}}' at parent indent
        return [
            indent([
                hardline,
                "{{",
                ...contentDoc,
            ]),
            hardline,
            "}}",
            hardline,
        ];
    }

    // Complex expression: indent inner content, align '}}' with '{{'
    return [
        indent([
            hardline,
            "{{",
            indent(contentDoc),
            hardline,
            "}}",
        ]),
        hardline,
    ];
}

function printElement(path, opts, print) {
    const node = path.getValue();
    const parts = [];

    // 在最前面定义 attrsArr，这样全函数都可以使用
    const attrsArr = (node.startTag && Array.isArray(node.startTag.attributes)) ? node.startTag.attributes : [];

    if (node.startTag) {
    // <text> 的处理采用 "早退" 策略，但在此之前仍然会打印开始标签
        parts.push(path.call(print, "startTag"));
    }
    if (node.children && node.children.length > 0) {
    // Decide whether to inline children based on their raw content
        const child0 = node.children[0];
        const isTextNodeType = (n) => n && (n.type === "WXText" || n.type === "WXCharData");
        const isTextLikeNode = (n) => isTextNodeType(n) || n.type === "WXInterpolation";
        const getNodeString = (n) => {
            if (isTextNodeType(n)) return typeof n.value === "string" ? n.value : "";
            if (n.type === "WXInterpolation") return typeof n.rawValue === "string" ? n.rawValue : "";
            return "";
        };
        const getNodeLen = (n) => getNodeString(n).length;

        // 检查标签是否有多个属性，如果有则强制不内联子节点
        const hasMultipleAttrs = attrsArr.length > 1;

        const trimmedLen0 = isTextNodeType(child0) && typeof child0.value === "string" ? child0.value.trim().length : 0;
        const singleTextInline = node.children.length === 1 &&
      			isTextNodeType(child0) &&
      			trimmedLen0 > 0 &&
    			trimmedLen0 < 50 &&
      			!child0.value.includes("\n");

        // Determine if children are purely textual/interpolation
        const onlyTextualChildren = node.children.every((n) => isTextLikeNode(n));
        const hasNewline = node.children.some((n) => getNodeString(n).includes("\n"));
        const totalLen = node.children.reduce((acc, n) => acc + getNodeLen(n), 0);
        const hasMeaningful = node.children.some((n) => (isTextNodeType(n) && typeof n.value === "string" && n.value.trim() !== "") || n.type === "WXInterpolation");
        const smallInlineMix = node.children.length <= 3 && onlyTextualChildren && !hasNewline && totalLen < 50 && hasMeaningful;

        const tagName = (node.startTag && node.startTag.name) || (node.endTag && node.endTag.name) || "";
        const lowerName = typeof tagName === "string" ? tagName.toLowerCase() : "";

        // EARLY RETURN for <text>: verbatim children, no manipulation
        // 说明：<text> 的子节点按原样输出，不进行空白折叠或换行控制；如果存在属性则强制不内联。
        if (lowerName === "text") {
            // 检查 <text> 是否有属性
            const textHasAttrs = attrsArr.length > 0;

            if (textHasAttrs) {
                // 如果有属性，则换行处理子节点
                for (let i = 0; i < node.children.length; i++) {
                    const childNode = node.children[i];
                    if ((childNode.type === "WXText" || childNode.type === "WXCharData") && typeof childNode.value === "string" && childNode.value.trim() === "") {
                        continue; // 跳过空白节点
                    }
                    const printed = path.call(print, "children", i);
                    if (printed && printed !== "") {
                        parts.push(printed);
                    }
                }
                if (node.endTag) {
                    parts.push(path.call(print, "endTag"));
                }
                // 分离内容和结束标签，结束标签单独占一行且不缩进
                const allParts = parts.slice(1); // 跳过开始标签
                if (allParts.length > 0) {
                    const endTag = allParts[allParts.length - 1]; // 最后一个是结束标签
                    const content = allParts.slice(0, -1); // 前面的是内容
                    return group([
                        parts[0], // <text ...>
                        indent([ hardline, ...content ]),
                        hardline,
                        endTag
                    ]);
                }
                return group(parts);
            } else {
                // 如果没有属性，按原来的逻辑处理（保持在同一行）
                for (let i = 0; i < node.children.length; i++) {
                    const childNode = node.children[i];
                    if ((childNode.type === "WXText" || childNode.type === "WXCharData") && typeof childNode.value === "string") {
                        parts.push(childNode.value);
                    } else if (childNode.type === "WXInterpolation" && typeof childNode.rawValue === "string") {
                        parts.push(childNode.rawValue);
                    } else {
                        parts.push(path.call(print, "children", i));
                    }
                }
                if (node.endTag) {
                    parts.push(path.call(print, "endTag"));
                }
                return group(parts);
            }
        }

        // Only true block-level tag that must never inline
        const isAlwaysBlock = lowerName === "block";

        // Build prefer-break tags set from options
        const preferBreakTagsInput = (typeof opts.wxmlPreferBreakTags === "string") ? opts.wxmlPreferBreakTags : "";
        const preferBreakTags = new Set(preferBreakTagsInput.split(",").map(s => s.trim().toLowerCase()).filter(Boolean));
        const isPreferBlock = preferBreakTags.has(lowerName);

        // Attributes presence (for simple <text> rule)
        const hasAnyAttrs = attrsArr.length > 0;

        // Simplified: treat <block> as always-block, selected tags as prefer-break.
        // 如果标签有任何属性且有子节点，强制不内联子节点
        let shouldInline = (singleTextInline || smallInlineMix) && !isAlwaysBlock && !isPreferBlock && !hasAnyAttrs;
        // Only <text> strictly checks: if it has any attributes, force break (no inline)
        if (lowerName === "text" && hasAnyAttrs) {
            shouldInline = false;
        }
        // For <text>, baseline: do not inline unless content is short/simple and structure is trivial
        if (lowerName === "text") {
            shouldInline = false;
            if (!hasAnyAttrs && onlyTextualChildren && !hasNewline && node.children.length === 1) {
                const only = node.children[0];
                const rawCombined = getNodeString(only);
                const trimmed = typeof rawCombined === "string" ? rawCombined.trim() : "";
                const isSingleMustache = trimmed.startsWith("{{") && trimmed.endsWith("}}");
                const containsMustache = typeof rawCombined === "string" && rawCombined.includes("{{");
                if (containsMustache && isSingleMustache) {
                    const inner = trimmed.slice(2, -2);
                    // Complexity heuristics: break if contains object/array literal, or has multiple &&, or both && and ||
                    const hasObjectLiteral = /\{[^}]*:/.test(inner);
                    const hasArrayLiteral = /\[[^,\]]*,[^\]]*\]/.test(inner) || /^\s*\[/.test(inner.trim());
                    const andCount = (inner.match(/&&/g) || []).length;
                    const hasOr = inner.includes("||");
                    const complex = hasObjectLiteral || hasArrayLiteral || andCount >= 2 || (andCount >= 1 && hasOr);
                    shouldInline = !complex;
                } else if (isTextNodeType(only)) {
                    // single pure text: inline if reasonably short
                    shouldInline = trimmed.length <= 50;
                }
            }
        }

        // Note: <text> is handled via early return above; strict text mode is unused.

        // Now collect printed children according to the decision
        const childrenParts = [];
        const childEntries = [];
        for (let i = 0; i < node.children.length; i++) {
            const childNode = node.children[i];
            if (!shouldInline && (childNode.type === "WXText" || childNode.type === "WXCharData") && typeof childNode.value === "string" && childNode.value.trim() === "") {
                continue; // drop whitespace-only nodes when not inlining
            }
            // Normal printing for non-<text> tags; <text> has already early-returned above.
            const printed = path.call(print, "children", i);
            if (printed && printed !== "") {
                childrenParts.push(printed);
                childEntries.push({ index: i, node: childNode, printed });
            }
        }

        if (childrenParts.length > 0) {
            if (shouldInline) {
                parts.push(...childrenParts);
            } else {
                const childrenWithBreaks = [];
                for (const [ i, printed ] of childrenParts.entries()) {
                    if (i > 0) childrenWithBreaks.push(hardline);
                    const entry = childEntries[i];
                    // Split multi-line text nodes into doc parts separated by hardline
                    if (entry && (entry.node.type === "WXText" || entry.node.type === "WXCharData") && typeof printed === "string" && printed.includes("\n")) {
                        const lines = printed.split("\n");
                        for (const [ li, line_ ] of lines.entries()) {
                            if (li > 0) childrenWithBreaks.push(hardline);
                            if (line_ !== "") {
                                childrenWithBreaks.push(line_);
                            }
                        }
                    } else {
                        childrenWithBreaks.push(printed);
                    }
                }
                {
                    // Special-case: multi-line mustache block like "{{\n  title\n}}" inside non-<text> tag
                    let didSpecial = false;
                    if (lowerName !== "text" && childrenParts.length === 1 && childEntries.length === 1) {
                        const entry0 = childEntries[0];
                        const printed0 = childrenParts[0];
                        const raw0 = getNodeString(entry0.node);
                        const isTextNode = entry0 && (entry0.node.type === "WXText" || entry0.node.type === "WXCharData");
                        if (isTextNode && typeof printed0 === "string") {
                            const mlDoc = buildMultiLineMustacheDocFromPrinted(printed0);
                            if (mlDoc) {
                                parts.push(...mlDoc);
                                didSpecial = true;
                            }
                        }
                    }
                    // Normal path
                    if (!didSpecial) {
                        parts.push(indent([ hardline, ...childrenWithBreaks ]), hardline);
                    }
                }
            }
        }
    }
    if (node.endTag) {
        // 检查是否有属性且没有子节点
        const hasAttrs = attrsArr.length > 0;
        const hasChildren = node.children && node.children.length > 0;

        // 如果有属性但没有子节点，结束标签应该换行
        if (hasAttrs && !hasChildren) {
            parts.push(hardline);
        }

        parts.push(path.call(print, "endTag"));
    }
    return group(parts);
}
function formatInlineJsExpression(expr, opts) {
    if (typeof expr !== "string") return expr;
    // 1) Collapse any newlines (and surrounding spaces) into a single space
    let s = expr.replaceAll(/[ \t]*[\r\n]+[ \t]*/g, " ");
    // 2) Normalize spaces around logical operators without touching others
    s = s.replaceAll(/\s*&&\s*/g, " && ").replaceAll(/\s*\|\|\s*/g, " || ");
    return s.trim();
}
function isPlaceholderLikeValue(value) {
    if (!value) return false;
    let s = String(value);
    // strip surrounding quotes if present
    if ((s.startsWith('"') && s.endsWith('"')) || (s.startsWith("'") && s.endsWith("'"))) {
        s = s.slice(1, -1);
    }
    // detect long runs of the same symbol characters (e.g., ======, ------, ______, ......, ~~~~~~)
    return /([=\-_.~*])\1{5,}/.test(s);
}



function normalizeAttrValueForWxmlQuotes(value, opts) {
    if (!value) return null;
    let attributeValue = String(value);
    // Apply inline expression formatting inside quotes or raw
    const isQuoted = (attributeValue.startsWith('"') && attributeValue.endsWith('"')) || (attributeValue.startsWith("'") && attributeValue.endsWith("'"));
    if (isQuoted) {
        const quote = attributeValue[0];
        let content = attributeValue.slice(1, -1);
        content = formatWxmlInterpolations(content, opts);
        // Decide final quote style based on preference and content
        const preferSingle = !!opts.wxmlSingleQuote;
        if (preferSingle && !content.includes("'")) {
            attributeValue = `'${content}'`;
        } else if (!preferSingle && !content.includes('"')) {
            attributeValue = `"${content}"`;
        } else {
            attributeValue = `${quote}${content}${quote}`;
        }
    } else {
    // Not quoted; first format interpolations then add quotes
        const content = formatWxmlInterpolations(attributeValue, opts);
        attributeValue = opts.wxmlSingleQuote ? `'${content}'` : `"${content}"`;
    }
    return attributeValue;
}
function formatWxmlInterpolations(text, opts) {
    if (typeof text !== "string" || !text.includes("{{")) return text;
    return text.replaceAll(/\{\{([\s\S]*?)\}\}/g, (match) => {
        const inner = match.slice(2, -2); // 去掉 {{ }}
        const leadingWs = inner.match(/^\s*/)[0];
        const trailingWs = inner.match(/\s*$/)[0];
        const expr = inner.slice(leadingWs.length, inner.length - trailingWs.length);
        const formatted = formatInlineJsExpression(expr, opts);
        return `{{${leadingWs}${formatted}${trailingWs}}}`;
    });
}


function printAttribute(path, opts, print) {
    const node = path.getValue();
    const { key, value, rawValue } = node;

    // Handle boolean attributes (no value)
    if (value === null) {
        return key;
    }

    // Normalize attribute value quoting per wxmlSingleQuote
    let attributeValue = rawValue || value;
    if (typeof attributeValue === "string") {
        attributeValue = normalizeAttrValueForWxmlQuotes(attributeValue, opts);
    }

    return `${key}=${attributeValue}`;
}

function printStartTag(path, opts, print) {
    // 从路径中获取当前节点
    const node = path.getValue();
    // 初始化部分数组，包含开始标签的 "<" 和标签名称
    const parts = [ "<", node.name ];
    // 检查是否存在属性且属性列表不为空
    if (node.attributes && node.attributes.length > 0) {
        // 将每个属性映射为格式化的属性文档字符串
        const attributeDocs = node.attributes.map((attr) => {
            return printAttribute({ getValue: () => attr }, opts, print);
        });

        // 计算所有属性字符串的总长度（包括空格分隔符）
        const attributesLength = attributeDocs.reduce((sum, current) => sum + String(current).length + 1, 0);


        // 获取打印宽度配置，如果没有指定则默认为 80
        const printWidth = (typeof opts.wxmlPrintWidth === "number") ? opts.wxmlPrintWidth : (opts.printWidth || 80);

        // 计算有多少个属性值看起来像占位符（包含长的重复符号）
        const placeholderCount = (node.attributes || []).filter((attr) => {
            const raw = attr.rawValue || attr.value;
            return isPlaceholderLikeValue(raw);
        }).length;



        // 为占位符属性增加惩罚值，使其更容易触发换行
        const placeholderPenalty = placeholderCount > 0 ? placeholderCount * 10 : 0;

        // 计算标签的大致长度：标签名 + 空格 + 属性长度 + 占位符惩罚
        const approximateLength = node.name.length + 1 + attributesLength + placeholderPenalty;

        // 判断是否应该换行：超过两个属性就换行，或满足其他原始条件
        const shouldBreak = node.attributes.length > 2 || approximateLength > printWidth ||  placeholderCount >= 2 ||  (node.selfClosing && node.attributes.length >= 4);

        // 根据换行决策处理属性
        if (shouldBreak) {
            // 如果需要换行，第一个属性保留在开始标签同一行，剩余属性换行显示
            if (attributeDocs.length > 1) {
                // 多个属性：第一个在同一行，后续与第一个对齐
                const firstAttr = attributeDocs[0];
                const restAttrs = attributeDocs.slice(1);
                parts.push(" ", firstAttr);
                // 计算与第一个属性对齐的缩进
                const firstAttrIndent = " ".repeat(node.name.length + 2); // "<" + tagName + space
                const indentedAttributes = [
                    hardline,
                    firstAttrIndent,
                    join([ hardline, firstAttrIndent ], restAttrs)
                ];
                parts.push(...indentedAttributes);
            } else {
                // 只有一个属性，保留在同一行
                parts.push(" ", attributeDocs[0]);
            }
        } else {
            // 如果不需要换行，在同一行显示所有属性，用空格分隔
            parts.push(" ", join(" ", attributeDocs));
        }
    }

    // 检查标签是否是自闭合标签（如 <view />）
    if (node.selfClosing) {
        // 自闭合标签：添加 " />"
        parts.push(" />");
    } else {
        // 普通标签：添加 ">"
        parts.push(">");
    }
    // 返回所有部分的数组，供上层调用者进一步处理
    return parts;
}


function printDocument(path, opts, print) {
    const node = path.getValue();
    const { body } = node;
    if (!body || body.length === 0) return "";
    const parts = [];
    let lastWasBlock = false; // blocks: element/script/comment
    body.forEach((child, index) => {
    // Drop whitespace-only top-level text nodes to avoid spurious blank lines
        if ((child.type === "WXText" || child.type === "WXCharData") && typeof child.value === "string" && child.value.trim() === "") {
            return;
        }
        const printed = path.call(print, "body", index);
        const isBlock = child.type === "WXElement" || child.type === "WXScript" || child.type === "WXComment";
        if (printed && printed !== "") {
            if (parts.length > 0 && (isBlock || lastWasBlock)) {
                parts.push(hardline);
            }
            parts.push(printed);
        }
        if (printed && printed !== "") {
            lastWasBlock = isBlock;
        }
    });
    if (parts.length > 0) {
        parts.push(hardline);
    }
    return group(parts);
}

function printComment(path) {
    const node = path.getValue();
    return `<!--${node.value}-->`;
}


export default {
    languages: prettierPluginMp.languages,
    parsers: prettierPluginMp.parsers,
    options: prettierPluginMp.options,

    printers: {
        ...prettierPluginMp.printers,
        wxml: {
            ...originalPrinter,
            print(path, opts, print) {

                const node = path.getValue();
                const ast = path.stack && path.stack[0];
                if (ast && ast.ignoreRanges && node.location) {
                    const nodeStart = node.location.startOffset;
                    const nodeEnd = node.location.endOffset;
                    for (const range of ast.ignoreRanges) {
                        if (nodeStart >= range.start && nodeEnd <= range.end) {
                            return opts.originalText.slice(nodeStart, nodeEnd);
                        }
                    }
                }
                switch (node.type) {
                    case "Program": {
                        return printDocument(path, opts, print);
                    }
                    case "WXAttribute": {
                        return printAttribute(path, opts, print);
                    }
                    case "WXCharData": {
                        return printCharData(path, opts, print);
                    }
                    case "WXComment": {
                        return printComment(path, opts, print);
                    }
                    case "WXElement": {
                        return printElement(path, opts, print);
                    }
                    case "WXEndTag": {
                        return printEndTag(path, opts, print);
                    }
                    case "WXInterpolation": {
                        if (!node.rawValue) {
                            throw new Error(`WXInterpolation node missing rawValue. This is a bug in the parser or printer.`);
                        }
                        return node.rawValue;
                    }
                    case "WXScript": {
                        return printMisc(path, opts, print);
                    }
                    case "WXStartTag": {
                        return printStartTag(path, opts, print);
                    }
                    case "WXText": {
                        return printCharData(path, opts, print);
                    }
                    default: {
                        throw new Error(`Unknown node type: ${node.type}. This is a bug in the printer.`);
                    }
                }
            },
        },
    },
};
