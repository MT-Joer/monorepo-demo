/*
  eslint-config/src/custom-config.ts

  目的：为 monorepo 内不同目录提供定制化的覆盖规则。
  关键点：
  - 使用 `files` 精准指定规则生效范围，避免对整个仓库产生副作用
  - 通过 `no-restricted-imports` 强制包边界，防止错误或循环依赖
  - 在构建/配置文件中放宽部分 import 限制（restrictedImportIgnores）以支持工具链需求
*/

import type { Linter } from "eslint";

import { customConfigMiniprogram } from "./miniprogram";
import { customConfigUniapp } from "./uniapp";
import { customConfigVben } from "./vben";


const customConfig: Linter.Config[] = [
    ...customConfigVben(),
    ...customConfigMiniprogram(),
    ...customConfigUniapp()
];

export { customConfig };
