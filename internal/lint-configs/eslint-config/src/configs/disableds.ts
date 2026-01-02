/*
  eslint-config/src/configs/disableds.ts

  说明：针对特定文件类型禁用某些不适用的规则以避免误报。
  要点：
  - 测试文件中禁用 @ts-comment 与 console 限制
  - .d.ts 类型定义文件禁用三斜线引用检查（可能需要三斜线引用 lib）
  - 纯 JS 文件禁用 TS 特定规则
*/

import type { Linter } from "eslint";

export async function disableds(): Promise<Linter.Config[]> {
    return [
        {
            files: [ "**/__tests__/**/*.?([cm])[jt]s?(x)" ],
            name: "disables/test",
            rules: {
                "@typescript-eslint/ban-ts-comment": "off",
                "no-console": "off",
            },
        },
        {
            files: [ "**/*.d.ts" ],
            name: "disables/dts",
            rules: {
                "@typescript-eslint/triple-slash-reference": "off",
            },
        },
        {
            files: [ "**/*.js", "**/*.mjs", "**/*.cjs" ],
            name: "disables/js",
            rules: {
                "@typescript-eslint/explicit-module-boundary-types": "off",
            },
        },
    ];
}
