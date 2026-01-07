/*
  eslint-config/src/index.ts

  目的：按模块化方式组合多个子配置（vue, typescript, prettier 等），并导出最终的 flat config。
  关键点：
  - 通过异步 `defineConfig` 聚合子模块，保持加载顺序可控
  - 将 prettier 放在较早位置以确保格式化规则正确生效
  - 支持在外部传入额外 config 以便在不同场景复用
*/

import type { Linter } from "eslint";

import {
    command,
    comments,
    disableds,
    ignores,
    importPluginConfig,
    javascript,
    jsdoc,
    jsonc,
    node,
    perfectionist,
    regexp,
    test,
    turbo,
    typescript,
    unicorn,
    vue,
    wxmlConfig,
} from "./configs";
import { prettier } from "./configs/prettier";
import { customConfig } from "./custom-config";

type FlatConfig = Linter.Config;

type FlatConfigPromise = FlatConfig | FlatConfig[] | Promise<FlatConfig> | Promise<FlatConfig[]>;

async function defineConfig(config: FlatConfig[] = []) {
    const configs: FlatConfigPromise[] = [
        vue(),
        javascript(),
        ignores(),
        prettier(),
        typescript(),
        jsonc(),
        disableds(),
        importPluginConfig(),
        node(),
        perfectionist(),
        comments(),
        jsdoc(),
        unicorn(),
        test(),
        regexp(),
        command(),
        turbo(),
        wxmlConfig(),
        ...customConfig,
        ...config,
    ];

    const resolved = await Promise.all(configs);

    return resolved.flat();
}
export { defineConfig };
