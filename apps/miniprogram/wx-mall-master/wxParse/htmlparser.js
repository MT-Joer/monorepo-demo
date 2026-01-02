/**
 *
 * htmlParser改造自: https://github.com/blowsie/Pure-JavaScript-HTML5-Parser
 *
 * author: Di (微信小程序开发工程师)
 * organization: WeAppDev(微信小程序开发论坛)(http://weappdev.com)
 *               垂直微信小程序开发交流社区
 *
 * github地址: https://github.com/icindy/wxParse
 *
 * for: 微信小程序富文本解析
 * detail : http://weappdev.com/t/wxparse-alpha0-1-html-markdown/184
 */
// Regular Expressions for parsing tags and attributes
const attr = /([a-z_:][-\w:.]*)(?:\s*=\s*(?:"((?:\\.|[^"])*)"|'((?:\\.|[^'])*)'|([^>\s]+)))?/gi;
const endTag = /^<\/([-\w]+)[^>]*>/;
const startTag = /^<([-\w]+)((?:\s+[a-z_:][-\w:.]*(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^>\s]+))?)*)\s*(\/?)>/i;

// Empty Elements - HTML 5
const empty = makeMap("area,base,basefont,br,col,frame,hr,img,input,link,meta,param,embed,command,keygen,source,track,wbr");

// Block Elements - HTML 5
const block = makeMap("a,address,code,article,applet,aside,audio,blockquote,button,canvas,center,dd,del,dir,div,dl,dt,fieldset,figcaption,figure,footer,form,frameset,h1,h2,h3,h4,h5,h6,header,hgroup,hr,iframe,ins,isindex,li,map,menu,noframes,noscript,object,ol,output,p,pre,section,script,table,tbody,td,tfoot,th,thead,tr,ul,video");

// Inline Elements - HTML 5
const inline = makeMap("abbr,acronym,applet,b,basefont,bdo,big,br,button,cite,del,dfn,em,font,i,iframe,img,input,ins,kbd,label,map,object,q,s,samp,script,select,small,span,strike,strong,sub,sup,textarea,tt,u,var");

// Elements that you can, intentionally, leave open
// (and which close themselves)
const closeSelf = makeMap("colgroup,dd,dt,li,options,p,td,tfoot,th,thead,tr");

// Attributes that have their values filled in disabled="disabled"
const fillAttrs = makeMap("checked,compact,declare,defer,disabled,ismap,multiple,nohref,noresize,noshade,nowrap,readonly,selected");

// Special Elements (can contain anything)
const special = makeMap("wxxxcode-style,script,style,view,scroll-view,block");

function HTMLParser(html, handler) {
    let chars; let index; let last = html; let match; const stack = [];
    stack.last = function () {
        return this[this.length - 1];
    };

    while (html) {
        chars = true;

        // Make sure we're not in a script or style element
        if (!stack.last() || !special[stack.last()]) {

            // Comment
            switch (0) {
                case html.indexOf("<!--"): {
                    index = html.indexOf("-->");

                    if (index >= 0) {
                        if (handler.comment)
                            handler.comment(html.substring(4, index));
                        html = html.slice(Math.max(0, index + 3));
                        chars = false;
                    }

                    // end tag
            
                    break;
                }
                case html.indexOf("<"): {
                    match = html.match(startTag);

                    if (match) {
                        html = html.slice(match[0].length);
                        match[0].replace(startTag, parseStartTag);
                        chars = false;
                    }
            
                    break;
                }
                case html.indexOf("</"): {
                    match = html.match(endTag);

                    if (match) {
                        html = html.slice(match[0].length);
                        match[0].replace(endTag, parseEndTag);
                        chars = false;
                    }

                    // start tag
            
                    break;
                }
            // No default
            }

            if (chars) {
                index = html.indexOf("<");
                let text = "";
                while (index === 0) {
                    text += "<";
                    html = html.slice(1);
                    index = html.indexOf("<");
                }
                text += index < 0 ? html : html.slice(0, Math.max(0, index));
                html = index < 0 ? "" : html.slice(Math.max(0, index));

                if (handler.chars)
                    handler.chars(text);
            }

        } else {

            html = html.replace(new RegExp(`([\\s\\S]*?)<\/${  stack.last()  }[^>]*>`), (all, text) => {
                text = text.replaceAll(/<!--([\s\S]*?)-->|<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1$2");
                if (handler.chars)
                    handler.chars(text);

                return "";
            });


            parseEndTag("", stack.last());
        }

        if (html === last)
            throw `Parse Error: ${  html}`;
        last = html;
    }

    // Clean up any remaining tags
    parseEndTag();

    function parseStartTag(tag, tagName, rest, unary) {
        tagName = tagName.toLowerCase();

        if (block[tagName]) {
            while (stack.last() && inline[stack.last()]) {
                parseEndTag("", stack.last());
            }
        }

        if (closeSelf[tagName] && stack.last() === tagName) {
            parseEndTag("", tagName);
        }

        unary = empty[tagName] || !!unary;

        if (!unary)
            stack.push(tagName);

        if (handler.start) {
            const attrs = [];

            rest.replaceAll(attr, function (match, name) {
                const value = arguments[2] ? arguments[2] :
                    arguments[3] ? arguments[3] :
                        arguments[4] ? arguments[4] :
                            fillAttrs[name] ? name : "";

                attrs.push({
                    name,
                    value,
                    escaped: value.replaceAll(/(^|[^\\])"/g, '$1\\\"') // "
                });
            });

            if (handler.start) {
                handler.start(tagName, attrs, unary);
            }

        }
    }

    function parseEndTag(tag, tagName) {
        // If no tag name is provided, clean shop
        if (tagName)
        {
            tagName = tagName.toLowerCase();
            for (var pos = stack.length - 1; pos >= 0; pos--)
                if (stack[pos] === tagName)
                    break;
        }

        // Find the closest opened tag of the same type
        else {var pos = 0;}
        if (pos >= 0) {
            // Close all the open elements, up the stack
            for (let i = stack.length - 1; i >= pos; i--)
                if (handler.end)
                    handler.end(stack[i]);

            // Remove the open elements from the stack
            stack.length = pos;
        }
    }
};


function makeMap(str) {
    const items = str.split(","); const obj = {};
    for (let i = 0; i < items.length; i++)
        obj[items[i]] = true;
    return obj;
}

module.exports = HTMLParser;
