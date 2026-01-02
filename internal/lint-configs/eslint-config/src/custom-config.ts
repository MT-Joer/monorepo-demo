/*
  eslint-config/src/custom-config.ts

  目的：为 monorepo 内不同目录提供定制化的覆盖规则。
  关键点：
  - 使用 `files` 精准指定规则生效范围，避免对整个仓库产生副作用
  - 通过 `no-restricted-imports` 强制包边界，防止错误或循环依赖
  - 在构建/配置文件中放宽部分 import 限制（restrictedImportIgnores）以支持工具链需求
*/

import type { Linter } from "eslint";

const restrictedImportIgnores = [
    "**/vite.config.mts",
    "**/tailwind.config.mjs",
    "**/postcss.config.mjs",
    "**/miniprogram_npm/**",
];

const customConfig: Linter.Config[] = [
    // shadcn-ui 内部组件是自动生成的，不做太多限制
    {
        files: [ "packages/@core/ui-kit/shadcn-ui/**/**" ],
        rules: {
            "vue/require-default-prop": "off",
        },
    },
    {
        files: [
            "apps/**/**",
            "packages/effects/**/**",
            "packages/utils/**/**",
            "packages/types/**/**",
            "packages/locales/**/**",
        ],
        ignores: restrictedImportIgnores,
        rules: {
            "perfectionist/sort-interfaces": "off",
            "perfectionist/sort-objects": "off",
        },
    },
    {
        files: [ "**/**.vue" ],
        ignores: restrictedImportIgnores,
        rules: {
            "perfectionist/sort-objects": "off",
        },
    },
    {
        // apps内部的一些基础规则
        files: [ "apps/**/**" ],
        ignores: restrictedImportIgnores,
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: [ "#/api/*" ],
                            message:
								"The #/api package cannot be imported, please use the @core package itself",
                        },
                        {
                            group: [ "#/layouts/*" ],
                            message:
								"The #/layouts package cannot be imported, please use the @core package itself",
                        },
                        {
                            group: [ "#/locales/*" ],
                            message:
								"The #/locales package cannot be imported, please use the @core package itself",
                        },
                        {
                            group: [ "#/stores/*" ],
                            message:
								"The #/stores package cannot be imported, please use the @core package itself",
                        },
                    ],
                },
            ],
            "perfectionist/sort-interfaces": "off",
        },
    },
    {
        // @core内部组件，不能引入@vben/* 里面的包
        files: [ "packages/@core/**/**" ],
        ignores: restrictedImportIgnores,
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: [ "@vben/*" ],
                            message:
								"The @core package cannot import the @vben package, please use the @core package itself",
                        },
                    ],
                },
            ],
        },
    },
    {
        // @core/shared内部组件，不能引入@vben/* 或者 @vben-core/* 里面的包
        files: [ "packages/@core/base/**/**" ],
        ignores: restrictedImportIgnores,
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: [ "@vben/*", "@vben-core/*" ],
                            message:
								"The @vben-core/shared package cannot import the @vben package, please use the @core/shared package itself",
                        },
                    ],
                },
            ],
        },
    },

    {
        // 不能引入@vben/*里面的包
        files: [
            "packages/types/**/**",
            "packages/utils/**/**",
            "packages/icons/**/**",
            "packages/constants/**/**",
            "packages/styles/**/**",
            "packages/stores/**/**",
            "packages/preferences/**/**",
            "packages/locales/**/**",
        ],
        ignores: restrictedImportIgnores,
        rules: {
            "no-restricted-imports": [
                "error",
                {
                    patterns: [
                        {
                            group: [ "@vben/*" ],
                            message:
								"The @vben package cannot be imported, please use the @core package itself",
                        },
                    ],
                },
            ],
        },
    },
    // 后端模拟代码，不需要太多规则
    {
        files: [ "apps/backend-mock/**/**", "docs/**/**" ],
        rules: {
            "@typescript-eslint/no-extraneous-class": "off",
            "n/no-extraneous-import": "off",
            "n/prefer-global/buffer": "off",
            "n/prefer-global/process": "off",
            "no-console": "off",
            "unicorn/prefer-module": "off",
        },
    },
    // 小程序目录允许使用 module.exports 及其他 legacy 语法
    // 小程序通常使用微信官方工具进行编译和开发，不支持 ES Modules，必须使用 CommonJS
    {
        files: [ "apps/**/miniprogram/**/**" ],
        rules: {
            // ==================== CommonJS 相关 ====================
            // 小程序强制使用 CommonJS，不支持 ES Modules 语法
            "unicorn/prefer-module": "off",
            // 小程序中 import 语句顺序不做要求，省流量
            "import/first": "off",
            // 小程序中 import 语句后不需要空行
            "import/newline-after-import": "off",
            // 小程序中 import 语句不需要自动排序
            "perfectionist/sort-imports": "off",

            // ==================== 变量声明相关 ====================
            // 小程序广泛使用 var，为全局作用域考虑，是必要的
            "no-var": "off",
            // 小程序中允许 var 声明不在块级作用域顶部
            "vars-on-top": "off",
            // 小程序中允许在块级作用域外引用块级变量
            "block-scoped-var": "off",
            // 小程序中频繁使用 var，不强制转换为 const
            "prefer-const": "off",

            // ==================== 函数相关 ====================
            // 小程序中使用 arguments 是常见做法，兼容性好
            "prefer-rest-params": "off",
            // 小程序中使用 reduce 很常见，不强制避免
            "unicorn/no-array-reduce": "off",
            // 小程序中直接传递数组方法作为回调很常见
            "unicorn/no-array-callback-reference": "off",
            // 小程序中三元表达式嵌套很常见，不强制避免
            "unicorn/no-nested-ternary": "off",

            // ==================== 访问相关 ====================
            // 小程序中使用 hasOwnProperty 用于对象属性检查是常见做法
            "no-prototype-builtins": "off",
            // 小程序中函数提升和前置引用很常见，基于运行时环境的特性
            "no-use-before-define": "off",

            // ==================== 正则表达式（性能） ====================
            // 小程序中正则表达式的性能优化通常由业务逻辑决定，不做强制要求
            "regexp/no-super-linear-backtracking": "off",
            "regexp/optimal-quantifier-concatenation": "off",
            "regexp/no-dupe-disjunctions": "off",
            "regexp/no-empty-capturing-group": "off",
            "regexp/no-empty-group": "off",
            // 小程序中使用不寻常的字符范围可能有业务原因
            "regexp/no-obscure-range": "off",
            // 小程序中正则的断言可能有特殊用途
            "regexp/no-useless-assertions": "off",
            "regexp/no-contradiction-with-assertion": "off",
            "regexp/no-misleading-capturing-group": "off",
            // 小程序可能需要使用旧版正则特性以兼容某些环境
            "regexp/no-legacy-features": "off",

            // ==================== 其他 ====================
            // 小程序中使用转义符有时是必要的，例如处理特殊字符
            "no-useless-escape": "off",
            // 小程序中可能需要抛出非 Error 对象
            "no-throw-literal": "off",
            // 小程序中保存 this 引用是常见做法
            "unicorn/no-this-assignment": "off",
            // 小程序中可能需要大范围禁用 ESLint 规则
            "eslint-comments/no-unlimited-disable": "off",
            // 小程序中数组回调不一定总是有 return
            "array-callback-return": "off",
            // 小程序中不强制使用 slice 替代 substring
            "unicorn/prefer-string-slice": "off",
            // 小程序中允许动态删除对象属性
            "@typescript-eslint/no-dynamic-delete": "off",
            // 小程序中可能需要 instanceof 检查内置对象
            "unicorn/no-instanceof-builtins": "off",
            // 小程序中不强制使用 codePointAt
            "unicorn/prefer-code-point": "off",
            // 小程序兼容性考虑，不强制使用 structuredClone
            "unicorn/prefer-structured-clone": "off",
            // 小程序中允许使用正则字面量
            "prefer-regex-literals": "off",
            // 小程序中条件赋值语句很常见
            "no-cond-assign": "off",
            // 小程序中全局变量赋值可能有业务需求
            "no-global-assign": "off",
            // 小程序中可能需要调用 alert
            "no-alert": "off",
            // 小程序中自赋值可能用于特定业务逻辑
            "no-self-assign": "off",
            // 小程序中空块有时用于占位或注释
            "no-empty": "off",
            // 小程序中不强制使用 Number 属性
            "unicorn/prefer-number-properties": "off",
            // 小程序中数组方法可能需要 this 参数
            "unicorn/no-array-method-this-argument": "off",
            // 小程序中 for 循环有时是必要的
            "unicorn/no-for-loop": "off",
            // 小程序中不强制使用默认参数
            "unicorn/prefer-default-parameters": "off"
        },
    },
    {
        files: [ "**/**/playwright.config.ts" ],
        rules: {
            "n/prefer-global/buffer": "off",
            "n/prefer-global/process": "off",
            "no-console": "off",
        },
    },
    {
        files: [ "internal/**/**", "scripts/**/**" ],
        rules: {
            "no-console": "off",
        },
    },
];

export { customConfig };
