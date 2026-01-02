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
    {
        files: [ "apps/**/miniprogram/**/**" ],
        rules: {
            // CommonJS 相关
            "unicorn/prefer-module": "off",
            "import/first": "off",
            "import/newline-after-import": "off",
            "perfectionist/sort-imports": "off",

            // 变量声明相关（var 在小程序中广泛使用）
            "no-var": "off",
            "vars-on-top": "off",
            "block-scoped-var": "off",
            "prefer-const": "off",

            // 函数相关
            "prefer-rest-params": "off",
            "unicorn/no-array-reduce": "off",
            "unicorn/no-array-callback-reference": "off",
            "unicorn/no-nested-ternary": "off",

            // 访问相关
            "no-prototype-builtins": "off",
            "no-use-before-define": "off",

            // 正则表达式（性能）
            "regexp/no-super-linear-backtracking": "off",
            "regexp/optimal-quantifier-concatenation": "off",
            "regexp/no-dupe-disjunctions": "off",
            "regexp/no-empty-capturing-group": "off",
            "regexp/no-empty-group": "off",
            "regexp/no-obscure-range": "off",
            "regexp/no-useless-assertions": "off",
            "regexp/no-contradiction-with-assertion": "off",
            "regexp/no-misleading-capturing-group": "off",
            "regexp/no-legacy-features": "off",

            // 其他
            "no-useless-escape": "off",
            "no-throw-literal": "off",
            "unicorn/no-this-assignment": "off",
            "eslint-comments/no-unlimited-disable": "off",
            "array-callback-return": "off",
            "unicorn/prefer-string-slice": "off",
            "@typescript-eslint/no-dynamic-delete": "off",
            "unicorn/no-instanceof-builtins": "off",
            "unicorn/prefer-code-point": "off",
            "unicorn/prefer-structured-clone": "off",
            "prefer-regex-literals": "off",
            "no-cond-assign": "off",
            "no-global-assign": "off",
            "no-alert": "off",
            "no-self-assign": "off",
            "no-empty": "off",
            "unicorn/prefer-number-properties": "off",
            "unicorn/no-array-method-this-argument": "off",
            "unicorn/no-for-loop": "off",
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
