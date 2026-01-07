/*
  eslint-config/src/configs/unicorn.ts

  说明：Unicorn 插件提供现代化的 JavaScript 最佳实践建议。
  要点：
  - 关闭大量规则以避免过度约束（如 filename-case, consistent-destructuring 等）
  - 在脚本目录中放宽 process.exit 限制
  - 合理保留部分规则（如 prefer-export-from）以提升代码质量
*/

import type { Linter } from "eslint";

import { interopDefault } from "../util";

export async function unicorn(): Promise<Linter.Config[]> {
    const [ pluginUnicorn ] = await Promise.all([ interopDefault(import("eslint-plugin-unicorn")) ] as const);

    return [
        {
            plugins: {
                unicorn: pluginUnicorn,
            },
            ignores: [ "**/*.wxml" ],
            rules: {
                ...pluginUnicorn.configs.recommended.rules,
                "unicorn/no-abusive-eslint-disable":"off",
                "unicorn/no-this-assignment":"warn",
                "unicorn/no-empty-file":"off",
                "unicorn/prefer-ternary":"off",
                "unicorn/prefer-spread":"off",
                "unicorn/prefer-logical-operator-over-ternary":"off",
                "unicorn/better-regex": "off",
                "unicorn/consistent-destructuring": "off",
                "unicorn/consistent-function-scoping": "off",
                "unicorn/expiring-todo-comments": "off",
                "unicorn/filename-case": "off",
                "unicorn/import-style": "off",
                "unicorn/no-array-for-each": "off",
                "unicorn/no-null": "off",
                "unicorn/no-useless-undefined": "off",
                "unicorn/prefer-at": "off",
                "unicorn/prefer-dom-node-text-content": "off",
                "unicorn/prefer-export-from": [ "error", { ignoreUsedVariables: true } ],
                "unicorn/prefer-global-this": "off",
                "unicorn/prefer-top-level-await": "off",
                "unicorn/prevent-abbreviations": "off",
            },
        },
        {
            files: [ "scripts/**/*.?([cm])[jt]s?(x)", "internal/**/*.?([cm])[jt]s?(x)" ],
            rules: {
                "unicorn/no-process-exit": "off",
            },
        },
    ];
}
