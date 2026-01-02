/*
  eslint-config/src/configs/jsdoc.ts

  说明：JSDoc 规则（eslint-plugin-jsdoc）用于检查文档注释的完整性与准确性。
  要点：
  - 对库/公共 API 包推荐启用此规则确保文档完整
  - 在此处启用为 warn 级别，允许对脚本/内部代码在 custom-config 中禁用
*/

import type { Linter } from "eslint";

import { interopDefault } from "../util";

export async function jsdoc(): Promise<Linter.Config[]> {
    const [ pluginJsdoc ] = await Promise.all([ interopDefault(import("eslint-plugin-jsdoc")) ] as const);

    return [
        {
            plugins: {
                jsdoc: pluginJsdoc,
            },
            rules: {
                "jsdoc/check-access": "warn",
                "jsdoc/check-param-names": "warn",
                "jsdoc/check-property-names": "warn",
                "jsdoc/check-types": "warn",
                "jsdoc/empty-tags": "warn",
                "jsdoc/implements-on-classes": "warn",
                "jsdoc/no-defaults": "warn",
                "jsdoc/no-multi-asterisks": "warn",
                "jsdoc/require-param-name": "warn",
                "jsdoc/require-property": "warn",
                "jsdoc/require-property-description": "warn",
                "jsdoc/require-property-name": "warn",
                "jsdoc/require-returns-check": "warn",
                "jsdoc/require-returns-description": "warn",
                "jsdoc/require-yields-check": "warn",
            },
        },
    ];
}
