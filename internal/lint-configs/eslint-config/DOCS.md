# ESLint 规则详解（仓库级）

此文档为 `internal/lint-configs/eslint-config` 的补充，逐条说明常见规则、插件及其为何在 monorepo 中被启用/禁用。

目录

- no-restricted-imports
- perfectionist（排序相关）
- unicorn（现代化建议）
- @typescript-eslint（类型检查相关）
- prettier 与 eslint 的协作
- jsdoc
- node / n 插件
- regexp / turbo / test 模块用途
- overrides 与 files/ignores 的设计理念

---

no-restricted-imports

- 作用：禁止特定模块或路径的导入，可指定 message 给出替代方案。
- 常见用法：在 monorepo 中阻止子包直接依赖另一个包的内部实现（例如禁止 `@core` 导入 `@vben/*`）。
- 为什么：保持包边界、避免紧耦合、促进清晰的公共 API 设计，降低后续重构成本。
- 注意点：在构建配置文件（vite/tailwind/postcss）中允许特定导入（通过 restrictedImportIgnores），以便工具正常运行。

perfectionist（排序相关）

- 作用：对对象属性、导出、接口成员等做一致性排序（alphabetical 或自定义策略）。
- 为什么：统一排序减少无意义的 diff，提升代码可读性与审查效率。
- 何时禁用：对于代码自动生成产物或特定结构化/语义重要的对象，排序可能破坏含义，此时会在 custom-config 中关闭相关规则。

unicorn

- 作用：提供一组现代 JS/TS 最佳实践（如使用 `Array.isArray`、避免隐式类型转换、用更语义化的方法替代低级 API 等）。
- 为什么：提升一致性与安全性，避免常见陷阱。
- 何时关闭：脚本、mock、demo 或 legacy 代码中可有选择关闭，以减少误报并提升开发灵活性。

@typescript-eslint

- 常见规则：`no-explicit-any`、`explicit-module-boundary-types`、`consistent-type-assertions` 等。
- 目的：强化类型层面的检查，捕获潜在类型错误，提升代码健壮性。
- 平衡点：严格规则能提高质量，但会增加迁移/重构成本。对生成代码或快速迭代目录可适当放宽。

prettier 与 eslint 的协作

- 原则：让 Prettier 负责格式（空格、单双引号、换行、尾逗号等），让 ESLint 负责语义/最佳实践。
- 实践：在 ESLint 配置中禁用与格式相关的规则（或使用 `eslint-config-prettier`），并通过 `prettier` 插件在 stylelint 中启用 `prettier/prettier`。
- 好处：避免工具间冲突，统一格式化输出，减少“格式导致的 lint 报错”。

jsdoc

- 用途：对公共 API 的注释进行校验，保证参数、返回值说明完整。
- 场景：对于 packages 下的库/组件包（对外 API）建议开启；对脚本或 demo 目录可关闭以减少噪音。

node / n 插件

- 作用：检查 Node 环境相关的最佳实践（如依赖声明、全局对象偏好等）。
- 场景：在 backend-mock、脚本或工具目录中放宽某些规则（例如 `n/no-extraneous-import`），以支持开发便利性。

regexp / turbo / test 模块

- 说明：这些模块把针对性的规则归类（正则安全、turbo monorepo 配置、测试文件的特殊规则），便于管理和定位问题。
- 目的：减少全局规则的复杂度，通过模块化针对不同场景提供不同强度的校验。

overrides 与 files/ignores 的设计理念

- 原则：使用 `files`/`ignores` 精确控制规则的作用范围——越精确越少误报。
- 实践：
    - 对构建/配置文件放宽某些限制（允许使用 Node 全局等）。
    - 对 `packages/@core/**` 强制边界规则，避免跨包直接依赖。
    - 对 demo/docs/mock 放宽大量规则以便快速迭代。

---

下一步建议

- 若希望把每个子模块的每一条 rule 都写成 inline 注释（便于在代码编辑器中直接查看），我可以按照优先级逐步将注释写入 `internal/lint-configs/eslint-config/src/configs` 下的文件：
    - 阶段 A（必做）：对 `prettier.ts`、`import.ts`、`typescript.ts`、`vue.ts` 添加逐条注释（解释为何开启/关闭某条规则）。
    - 阶段 B（可选）：对其余模块（如 `unicorn.ts`、`perfectionist.ts`、`node.ts`）执行同样操作。

请回复要执行的方案（例如：`inline 全部`、`inline A 阶段`、`仅生成 DOCS.md`）。
