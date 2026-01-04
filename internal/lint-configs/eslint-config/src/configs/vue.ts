/*
  eslint-config/src/configs/vue.ts

  说明：Vue 相关规则集合，基于 `eslint-plugin-vue` 的推荐/强制集成并做适配。
  要点：
  - 使用 vue-eslint-parser 解析 .vue 单文件组件
  - 合理开启与关闭规则以兼顾一致性与开发体验（例如 template 命名、属性风格）
*/

import type { Linter } from "eslint";

import { interopDefault } from "../util";

export async function vue(): Promise<Linter.Config[]> {
    const [ pluginVue, parserVue, parserTs ] = await Promise.all([
        interopDefault(import("eslint-plugin-vue")),
        interopDefault(import("vue-eslint-parser")),
        interopDefault(import("@typescript-eslint/parser")),
    ] as const);

    const flatEssential = pluginVue.configs?.["flat/essential"] || [];
    const flatStronglyRecommended = pluginVue.configs?.["flat/strongly-recommended"] || [];
    const flatRecommended = pluginVue.configs?.["flat/recommended"] || [];

    return [
        ...flatEssential,
        ...flatStronglyRecommended,
        ...flatRecommended,
        {
            // 针对 .vue 文件的专属规则
            files: [ "**/*.vue" ],
            languageOptions: {
                // globals: {
                //   computed: 'readonly',
                //   defineEmits: 'readonly',
                //   defineExpose: 'readonly',
                //   defineProps: 'readonly',
                //   onMounted: 'readonly',
                //   onUnmounted: 'readonly',
                //   reactive: 'readonly',
                //   ref: 'readonly',
                //   shallowReactive: 'readonly',
                //   shallowRef: 'readonly',
                //   toRef: 'readonly',
                //   toRefs: 'readonly',
                //   watch: 'readonly',
                //   watchEffect: 'readonly',
                // },
                parser: parserVue,
                parserOptions: {
                    ecmaFeatures: {
                        jsx: true,
                    },
                    extraFileExtensions: [ ".vue" ],
                    parser: parserTs,
                    sourceType: "module",
                },
            },
            plugins: {
                vue: pluginVue,
            },
            processor: pluginVue.processors?.[".vue"],
            rules: {
                // 继承插件基础规则
                ...pluginVue.configs?.base?.rules,

				 "array-bracket-spacing": [ "error", "always" ],
                /**
				 * vue/attribute-hyphenation: 要求模板属性使用连字符风格
				 * 设置原因: HTML 属性习惯上使用连字符（kebab-case），与 HTML 标准一致，便于代码审阅和 HTML 直接识别
				 */
                "vue/attribute-hyphenation": [
                    "error",
                    "always",
                    {
                        ignore: [],
                    },
                ],

                /**
				 * vue/block-order: 强制 .vue 文件块的顺序
				 * 设置原因: 统一的块顺序（template -> script -> style）提供一致的约定，便于团队审阅和代码查找
				 */
                "vue/block-order": [
                    "error",
                    {
                        order: [ "template", "script", "style" ],
                    },
                ],

                // 强制：Vue HTML 元素自闭合格式（如 <image /> 而非 <image></image>）
                "vue/html-self-closing": [
                    "error",
                    {
                        html: {
                            void: "any", // 原生空标签（如 <img>）允许任意自闭合格式
                            normal: "any", // 原生普通标签（如 <div>）允许任意自闭合格式
                            component: "any", // 自定义组件（如 <MyComponent>）允许任意自闭合格式
                        },
                        svg: "any", // SVG 标签允许任意自闭合格式
                        math: "any", // MathML 标签允许任意自闭合格式
                    },
                ],
                // 强制：Vue HTML 标签闭合括号不换行
                "vue/html-closing-bracket-newline": [
                    "error",
                    {
                        singleline: "never", // 单行标签：闭合括号不换行（如 <image src="xxx" />）
                        multiline: "never", // 多行标签：闭合括号不换行（如 <image\n  src="xxx"\n/>）
                    },
                ],
                /**
				 * vue/component-name-in-template-casing: 要求模板中的组件使用 PascalCase 命名
				 * 设置原因: PascalCase 使组件易于识别，与 JavaScript 类的命名约定一致，提高代码可读性
				 */
                "vue/component-name-in-template-casing": [ "error", "PascalCase" ],

                /**
				 * vue/component-options-name-casing: 要求组件选项名使用 PascalCase
				 * 设置原因: 组件选项如 MyComponent 使用 PascalCase，与类和构造函数的命名约定一致
				 */
                "vue/component-options-name-casing": [ "error", "PascalCase" ],

                /**
				 * vue/custom-event-name-casing: 要求自定义事件名使用 camelCase
				 * 设置原因: camelCase 是 JavaScript 事件的标准命名约定（如 onClick、onChange），保持一致性
				 */
                "vue/custom-event-name-casing": [ "error", "camelCase" ],

                /**
				 * vue/define-macros-order: 强制 defineXxx 宏的执行顺序
				 * 设置原因: 固定的宏顺序提高代码可读性和一致性，便于快速定位组件的 props、emits 等定义
				 */
                "vue/define-macros-order": [
                    "error",
                    {
                        order: [ "defineOptions", "defineProps", "defineEmits", "defineSlots" ],
                    },
                ],

                /**
				 * vue/dot-location: 强制点号位置在属性上
				 * 设置原因: 点号位于属性左侧（property）时，更符合代码链式调用的视觉习惯
				 */
                "vue/dot-location": [ "error", "property" ],

                /**
				 * vue/dot-notation: 要求使用点号记法而不是括号记法访问属性
				 * 设置原因: 点号记法（obj.prop）比括号记法（obj['prop']）更简洁易读，allowKeywords 允许使用保留字作属性
				 */
                "vue/dot-notation": [ "error", { allowKeywords: true } ],

                /**
				 * vue/eqeqeq: 要求使用 === 和 !== 而不是 == 和 !=
				 * 设置原因: smart 模式允许与 null 比较时使用 ==，避免隐式类型转换导致的 bug，同时保持常见情况的简洁
				 */
                "vue/eqeqeq": [ "error", "smart" ],
                // 控制 Vue 模板中 HTML 标签的缩进
                "vue/html-indent": [
                    "error",
                    4, // 缩进空格数
                    {
                        attribute: 1, // 属性换行后缩进 1 级（与标签名对齐）
                        baseIndent: 1, // 标签基础缩进
                        closeBracket: 0, // 闭合标签与开始标签对齐
                        alignAttributesVertically: true, // 多属性时垂直对齐
                        ignores: [], // 无需忽略的标签
                    },
                ],

                /**
				 * vue/html-quotes: 要求 HTML 属性值使用双引号
				 * 设置原因: 双引号是 HTML 的标准写法，与代码规范一致，提高统一性
				 */
                "vue/html-quotes": [ "error", "double" ],

                /**
				 * vue/max-attributes-per-line: 强制：Vue 元素属性每行最多数量限制
				 */
                "vue/max-attributes-per-line": [
                    "error",
                    {
                        singleline: 2, // 单行元素最多允许 2 个属性（如 <image src="xxx" alt="xxx">）
                        multiline: 1, // 多行元素每行最多 1 个属性（每个属性单独一行）
                    },
                ],
                // 强制：Vue 多行 HTML 元素的内容前后必须换行
                "vue/multiline-html-element-content-newline": [
                    "error",
                    {
                        ignoreWhenEmpty: false, // 即使元素内容为空，也要求换行（如 <div>\n</div>）
                        ignores: [], // 无忽略的元素（所有多行元素都生效）
                        allowEmptyLines: true, // 允许内容前后存在空白行
                    },
                ],

                // 强制：Vue 单行 HTML 元素的内容前后换行规则
                "vue/singleline-html-element-content-newline": [
                    "error",
                    {
                        externalIgnores: [ "text" ], // 忽略 <text> 标签（单行 <text> 内容无需换行，适用于 Vue 小程序等场景）
                    },
                ],
                // 强制：Vue 元素首属性的换行格式
                "vue/first-attribute-linebreak": [
                    "error",
                    {
                        singleline: "beside", // 单行属性：首属性紧跟标签名（不换行）
                        multiline: "beside", // 多行属性：首属性也紧跟标签名（注：原注释描述与配置冲突，按配置「不换行」，如需换行可改为 "below"）
                    },
                ],
                "vue/attributes-order": [
                    "error",
                    {
                        order: [
                            "DEFINITION", // is
                            "LIST_RENDERING", // v-for
                            "CONDITIONALS", // v-if v-else-if v-else v-show v-cloak
                            "RENDER_MODIFIERS", // v-once v-pre
                            "GLOBAL", // id
                            "UNIQUE", // ref key
                            "SLOT", // v-slot slot
                            "TWO_WAY_BINDING", // v-model
                            "OTHER_DIRECTIVES", // v-custom-directive
                            "OTHER_ATTR", // 自定义属性和其他
                            "EVENTS", // @click @focus
                            "CONTENT", // v-text v-html
                        ],
                        alphabetical: true, // 是否在同组内再按字母排序（建议 false，官方默认顺序更好）
                    },
                ],

                /**
				 * vue/multi-word-component-names: 要求组件名由多个单词组成
				 * 设置原因: 关闭此规则以支持单词组件名（如 Input、Button），增加灵活性，特别是对 UI 组件库
				 */
                "vue/multi-word-component-names": "off",

                /**
				 * vue/no-empty-pattern: 禁止空的解构模式
				 * 设置原因: 空模式 {} 或 [] 表示的意图不明确，通常是代码错误，应该避免
				 */
                "vue/no-empty-pattern": [ "error", { "allowObjectPatternsAsParameters": false } ],

                /**
				 * vue/no-extra-parens: 禁止不必要的括号
				 * 设置原因: 仅禁止函数表达式的多余括号，保持代码简洁，避免视觉混乱
				 */
                "vue/no-extra-parens": [ "error", "functions" ],

                /**
				 * vue/no-irregular-whitespace: 禁止不规则的空白符
				 * 设置原因: 不规则空白（如零宽空格、非法制表符）导致隐藏 bug 且难以排查，应该禁止
				 */
                "vue/no-irregular-whitespace": "error",

                /**
				 * vue/no-loss-of-precision: 禁止数值精度丢失
				 * 设置原因: 超出 JavaScript 安全整数范围的数值会丢失精度，导致计算错误，应该禁止
				 */
                "vue/no-loss-of-precision": "error",

                /**
				 * vue/no-reserved-component-names: 禁止使用 Vue 保留的组件名
				 * 设置原因: 关闭此规则以支持如 Component、Transition 等保留名组件，增加灵活性
				 */
                "vue/no-reserved-component-names": "off",

                /**
				 * vue/no-restricted-syntax: 禁止某些语法结构
				 * 设置原因: 禁止 debugger（生产遗留）、标记语句（不推荐）和 with 语句（易出错），提高代码质量
				 */
                "vue/no-restricted-syntax": [ "error", "DebuggerStatement", "LabeledStatement", "WithStatement" ],

                /**
				 * vue/no-restricted-v-bind: 禁止 v-bind 绑定以 'v-' 开头的属性
				 * 设置原因: 以 'v-' 开头的属性是 Vue 指令前缀，不应通过 v-bind 动态绑定，避免混淆
				 */
                "vue/no-restricted-v-bind": [ "error", "/^v-/" ],

                /**
				 * vue/no-sparse-arrays: 禁止稀疏数组（数组中有空槽）
				 * 设置原因: 稀疏数组中的空槽易导致 bug，通常是代码错误，应该明确使用 undefined
				 */
                "vue/no-sparse-arrays": "error",

                /**
				 * vue/no-unused-refs: 禁止未使用的 ref
				 * 设置原因: 未使用的 ref 是冗余代码，应该删除以保持代码整洁
				 */
                "vue/no-unused-refs": "error",

                /**
				 * vue/no-useless-v-bind: 禁止无用的 v-bind
				 * 设置原因: v-bind:foo="bar" 等同于 :foo="bar"，无需冗余绑定，应简化代码
				 */
                "vue/no-useless-v-bind": "error",

                /**
				 * vue/object-shorthand: 要求使用对象属性简写
				 * 设置原因: { foo, bar } 比 { foo: foo, bar: bar } 更简洁，避免不必要的冗余，avoidQuotes 在必要时保留引号
				 */
                "vue/object-shorthand": [
                    "error",
                    "always",
                    {
                        avoidQuotes: true,
                        ignoreConstructors: false,
                    },
                ],

                /**
				 * vue/one-component-per-file: 要求每个 .vue 文件只定义一个组件
				 * 设置原因: 单一职责原则，一个文件一个组件便于维护、测试和代码复用，提高项目可维护性
				 */
                "vue/one-component-per-file": "error",

                /**
				 * vue/prefer-import-from-vue: 优先从 'vue' 导入 API
				 * 设置原因: 统一从官方包导入，避免从其他来源（如 @vue/composition-api）导入，保证 API 的稳定性和兼容性
				 */
                "vue/prefer-import-from-vue": "error",

                /**
				 * vue/prefer-separate-static-class: 优先将静态 class 分离
				 * 设置原因: 将静态 class 分离为 class="static" 而不是 class="static" :class="dynamic"，提高代码可读性
				 */
                "vue/prefer-separate-static-class": "error",

                /**
				 * vue/prefer-template: 优先使用模板字符串而不是字符串拼接
				 * 设置原因: 模板字符串 `text ${variable}` 比拼接 'text ' + variable 更简洁易读
				 */
                "vue/prefer-template": "error",

                /**
				 * vue/prop-name-casing: 要求 prop 名使用 camelCase
				 * 设置原因: JavaScript 对象属性使用 camelCase，props 作为 JavaScript 对象属性应保持一致
				 */
                "vue/prop-name-casing": [ "error", "camelCase" ],

                /**
				 * vue/require-default-prop: 要求所有 prop 有默认值
				 * 设置原因: 显式的默认值减少组件使用时的不确定行为，提高代码安全性。可在 custom-config 中为自动生成组件关闭
				 */
                "vue/require-default-prop": "error",

                /**
				 * vue/require-explicit-emits: 要求显式声明所有 emit 事件
				 * 设置原因: 显式声明增强代码的自文档性，便于了解组件的事件接口，提高维护性
				 */
                "vue/require-explicit-emits": "error",

                /**
				 * vue/require-prop-types: 要求 prop 定义类型
				 * 设置原因: 关闭此规则，由 TypeScript 的类型系统保证类型安全，无需重复定义
				 */
                "vue/require-prop-types": "off",

                /**
				 * vue/space-infix-ops: 要求中缀操作符前后有空格
				 * 设置原因: a + b 比 a+b 更易读，中缀操作符前后的空格提高代码可读性
				 */
                "vue/space-infix-ops": "error",

                /**
				 * vue/space-unary-ops: 要求一元操作符前后有空格
				 * 设置原因: typeof x 比 typeosx 清晰，words 为 true 使 typeof、delete 等词类操作符前后加空格，nonwords 为 false 不要求 ++、-- 前后空格
				 */
                "vue/space-unary-ops": [ "error", { nonwords: false, words: true } ],

                /**
				 * vue/v-on-event-hyphenation: 要求 v-on 事件名使用连字符风格
				 * 设置原因: HTML 事件习惯上使用 kebab-case（如 @on-click），与 HTML 属性命名一致，autofix 可自动修复违反规则的代码
				 */
                "vue/v-on-event-hyphenation": [
                    "error",
                    "always",
                    {
                        autofix: true,
                        ignore: [],
                    },
                ],
            },
        },
    ];
}
