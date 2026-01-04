/*
  eslint-config/src/configs/typescript.ts

  说明：TypeScript 相关规则（@typescript-eslint）用于增强类型层面的检查。
  要点：
  - 使用 parser 与 plugin 提供更严格的类型检查与建议
  - 对生成代码或快速迭代目录保留部分放宽项（例如关闭某些严格规则）
*/

import type { Linter } from "eslint";

import { interopDefault } from "../util";

export async function typescript(): Promise<Linter.Config[]> {
    const [ pluginTs, parserTs ] = await Promise.all([
        interopDefault(import("@typescript-eslint/eslint-plugin")),
        interopDefault(import("@typescript-eslint/parser")),
    ] as const);

    return [
        {
            files: [ "**/*.?([cm])[jt]s?(x)" ],
            languageOptions: {
                parser: parserTs,
                parserOptions: {
                    // 不使用 createDefaultProgram 以避免性能问题，项目使用基于 glob 的 tsconfig
                    createDefaultProgram: false,
                    ecmaFeatures: {
                        jsx: true,
                    },
                    ecmaVersion: "latest",
                    extraFileExtensions: [ ".vue" ],
                    jsxPragma: "React",
                    project: "./tsconfig.*.json",
                    sourceType: "module",
                },
            },
            plugins: {
                "@typescript-eslint": pluginTs as any,
            },
            rules: {
                ...pluginTs.configs["eslint-recommended"]?.overrides?.[0]?.rules,
                ...pluginTs.configs.strict?.rules,
                "@typescript-eslint/no-require-imports":"warn",
                // 对 @ts-xxx 注释进行限制：允许带说明的忽略以便在确有必要时记录原因
                "@typescript-eslint/ban-ts-comment": [
                    "error",
                    {
                        "ts-check": false,
                        "ts-expect-error": "allow-with-description",
                        "ts-ignore": "allow-with-description",
                        "ts-nocheck": "allow-with-description",
                    },
                ],

                // '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],
                // 关闭统一类型定义风格限制，团队可自由选择 interface/type
                "@typescript-eslint/consistent-type-definitions": "off",
                "@typescript-eslint/explicit-function-return-type": "off",
                "@typescript-eslint/explicit-module-boundary-types": "off",
                "@typescript-eslint/no-empty-function": [
                    "error",
                    {
                        allow: [ "arrowFunctions", "functions", "methods" ],
                    },
                ],
                "@typescript-eslint/no-explicit-any": "off",
                "@typescript-eslint/no-namespace": "off",
                // 禁止非空断言以避免隐藏潜在的 undefined/null 错误
                "@typescript-eslint/no-non-null-assertion": "error",
                "@typescript-eslint/no-unused-expressions": "off",
                // 忽略以 `_` 开头的未使用变量，用于占位或为接口兼容保留参数
                "@typescript-eslint/no-unused-vars": [
                    "warn",
                    {
                        argsIgnorePattern: "^_",
                        varsIgnorePattern: "^_",
                    },
                ],
                "@typescript-eslint/no-use-before-define": "off",
                // 禁止使用 require，鼓励使用 import，除非在构建/配置脚本中例外
                "@typescript-eslint/no-var-requires": "error",
                "unused-imports/no-unused-vars": "warn",
            },
        },
        ignoresMiniprogram(pluginTs, parserTs),

    ];
}


function ignoresMiniprogram(pluginTs: any, parserTs:any): Linter.Config {
    return  {
        files: [ "apps/miniprogram/**/*.?([cm])[jt]s?(x)" ],
			    languageOptions: {
            parser: parserTs,
            parserOptions: {
                createDefaultProgram: false,
                ecmaFeatures: {
                    jsx: true,
                },
                ecmaVersion: "latest",
                extraFileExtensions: [ ".vue" ],
                jsxPragma: "React",
                project: "./tsconfig.*.json",
                sourceType: "module",
            },
        },
        plugins: {
            "@typescript-eslint": pluginTs as any,
        },
        rules: {
            "@typescript-eslint/no-require-imports": "off",
            "@typescript-eslint/no-var-requires": "off",
            "@typescript-eslint/no-unused-vars": "off",
            "@typescript-eslint/no-this-alias":"off",
            "@typescript-eslint/no-extraneous-class":"off",
            "@typescript-eslint/no-unsafe-function-type":"off"
        },
    };
}
