/*
  eslint-config/src/configs/turbo.ts

  说明：Turbo monorepo 相关规则（eslint-config-turbo），用于检查 turbo.json 配置。
  要点：
  - 该配置通过插件方式集成，插件无需额外规则定义
*/

import type { Linter } from "eslint";

import { interopDefault } from "../util";

export async function turbo(): Promise<Linter.Config[]> {
    const [ pluginTurbo ] = await Promise.all([ interopDefault(import("eslint-config-turbo")) ] as const);

    return [
        {
            plugins: {
                turbo: pluginTurbo,
            },
        },
    ];
}
