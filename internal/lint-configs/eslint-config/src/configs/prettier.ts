/*
  eslint-config/src/configs/prettier.ts

  说明：将 Prettier 与 ESLint 联动（通过 `eslint-plugin-prettier`），让 Prettier 负责格式化相关规则。
  要点：
  - 将 `prettier/prettier` 设为 error，CI 上确保格式化一致性
  - 在此处仅启用插件与规则，具体格式由仓库根/包级 prettier 配置控制
*/

import type { Linter } from "eslint";

import { interopDefault } from "../util";

export async function prettier(): Promise<Linter.Config[]> {
    const [ pluginPrettier ] = await Promise.all([
        interopDefault(import("eslint-plugin-prettier")),
    ] as const);
    return [
        {
            plugins: {
                prettier: pluginPrettier,
            },
            rules: {
                // 由 Prettier 统一负责格式，报告为 error 以在 CI 中强制通过格式检查
                "prettier/prettier": "error",
            },
        },
    ];
}
