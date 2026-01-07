/*
  stylelint-config/index.mjs

  目的：为仓库样式（CSS/SCSS/vue style blocks）提供一致的校验与声明顺序规则。
  关键点：
  - 使用 standard + recess-order 保证声明顺序与基础校验
  - 对 .vue/.html/.scss 使用不同的 customSyntax 以正确解析内联样式与 SCSS 特性
  - 与 prettier 协同（stylelint-prettier）让 prettier 负责格式化细节

  说明：该配置忽略 JS/TS/JSON/MD 等非样式文件；若特定 package 有特殊需求，可以在该 package 内覆写。
*/
import { configMiniprogram } from "./config/miniprogram";

export default {
    // 继承的预设配置
    // stylelint-config-standard: 标准的 CSS 规则
    // stylelint-config-recess-order: 声明属性顺序规则
    extends: [ "stylelint-config-standard", "stylelint-config-recess-order" ],

    // 忽略的文件类型（非样式文件）
    ignoreFiles: [
        "**/*.js",
        "**/*.jsx",
        "**/*.tsx",
        "**/*.ts",
        "**/*.json",
        "**/*.md",
    ],

    // 针对不同文件类型的特殊配置覆盖
    overrides: [
        ...configMiniprogram(),
        // HTML 和 Vue 文件的配置
        {
            // 使用 postcss-html 解析器处理 HTML/Vue 中的样式块
            customSyntax: "postcss-html",
            files: [ "*.(html|vue)", "**/*.(html|vue)" ],
            rules: {
                // Vue 的伪类选择器（如 :global, :deep）
                "selector-pseudo-class-no-unknown": [
                    true,
                    {
                        ignorePseudoClasses: [ "global", "deep" ],
                    },
                ],
                // Vue 的伪元素选择器（如 v-deep, v-global）
                "selector-pseudo-element-no-unknown": [
                    true,
                    {
                        ignorePseudoElements: [
                            "v-deep",
                            "v-global",
                            "v-slotted",
                        ],
                    },
                ],
            },
        },
        // SCSS 文件的配置
        {
            // 使用 postcss-scss 解析器处理 SCSS 语法
            customSyntax: "postcss-scss",
            extends: [
                "stylelint-config-recommended-scss",
                "stylelint-config-recommended-vue/scss",
            ],
            files: [ "*.scss", "**/*.scss" ],
        },
    ],

    // 加载的插件
    plugins: [
        "stylelint-order",           // CSS 声明顺序
        "@stylistic/stylelint-plugin", // 代码风格
        // "stylelint-prettier",        // 与 Prettier 集成（已禁用，改用 stylelint 扩展）
        "stylelint-scss",            // SCSS 特定规则
    ],

    // 规则配置
    rules: {
        // 禁用已弃用的 @-rules 警告
        "at-rule-no-deprecated": null,
        // 允许未知的 @-rules（SCSS 和 Tailwind 专用规则）
        "at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "extends",   // SCSS 扩展
                    "ignores",   // SCSS 忽略
                    "include",   // SCSS mixin 包含
                    "mixin",     // SCSS mixin 定义
                    "if",        // SCSS 条件
                    "else",      // SCSS else
                    "media",     // 媒体查询
                    "for",       // SCSS 循环
                    "at-root",   // SCSS at-root
                    "tailwind",  // Tailwind CSS
                    "apply",     // Tailwind 应用
                    "variants",  // Tailwind 变体
                    "responsive", // Tailwind 响应式
                    "screen",    // Tailwind 屏幕大小
                    "function",  // SCSS 函数
                    "each",      // SCSS each 循环
                    "use",       // SCSS use
                    "forward",   // SCSS forward
                    "return",    // SCSS return
                ],
            },
        ],
        // 禁用缺少通用字体族关键字的警告
        "font-family-no-missing-generic-family-keyword": null,
        // 禁用未知函数的警告
        "function-no-unknown": null,
        // 禁用导入符号规则
        "import-notation": null,
        // 禁用媒体查询范围符号规则
        "media-feature-range-notation": null,
        // 禁用网格区域验证
        "named-grid-areas-no-invalid": null,
        // 禁用特异性递减警告
        "no-descending-specificity": null,
        // 禁用空源文件警告
        "no-empty-source": null,

        // CSS 属性声明顺序规则（关键配置）
        "order/order": [
            [
                "dollar-variables",      // SCSS 变量
                "custom-properties",     // CSS 自定义属性
                "at-rules",              // @-rules
                "declarations",          // 普通声明
                {
                    name: "supports",
                    type: "at-rule",
                },
                {
                    name: "media",
                    type: "at-rule",
                },
                {
                    name: "include",      // SCSS include
                    type: "at-rule",
                },
                "rules",                 // 嵌套规则
            ],
            { severity: "error" },
        ],

        // Prettier 格式化规则（暂时禁用，由 prettier 处理）
        // "prettier/prettier": true,

        // 规则前的空行（忽略注释后和第一个嵌套元素）
        "rule-empty-line-before": [
            "always",
            {
                ignore: [ "after-comment", "first-nested" ],
            },
        ],

        // SCSS 特定的 @-rules 规则（同 at-rule-no-unknown）
        "scss/at-rule-no-unknown": [
            true,
            {
                ignoreAtRules: [
                    "extends",
                    "ignores",
                    "include",
                    "mixin",
                    "if",
                    "else",
                    "media",
                    "for",
                    "at-root",
                    "tailwind",
                    "apply",
                    "variants",
                    "responsive",
                    "screen",
                    "function",
                    "each",
                    "use",
                    "forward",
                    "return",
                ],
            },
        ],
        // 禁用 SCSS 操作符后换行规则
        "scss/operator-no-newline-after": null,

        // CSS 类名规则（支持 BEM、工具类、状态类、下划线分隔等规范）
        // 允许的格式：o-, c-, u-, t-, s-, is-, has-, _-, js-, qa- 前缀，支持 BEM __ -- 语法，支持下划线分隔
        "selector-class-pattern":
			"^(?:(?:o|c|u|t|s|is|has|_|js|qa)-)?[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*(?:__[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*)?(?:--[a-zA-Z0-9]+(?:[_-][a-zA-Z0-9]+)*)?(?:[.+])?$",

        // CSS 自定义属性规则（支持 kebab-case 和 camelCase）
        "custom-property-pattern": "^[a-zA-Z][a-zA-Z0-9_-]*$",

        // 禁用 :not() 伪类符号规则
        "selector-not-notation": null,
    },
};
