# 配置说明（注释汇总）

此文档对仓库内的 lint/format 配置做集中注释，解释各配置项为何这样设置，便于团队理解和维护。

---

## commitlint-config/index.mjs

- extends: ['@commitlint/config-conventional']
    - 说明：使用广泛的 conventional commits 规则作为基础，保证 commit message 结构化（type(scope): subject）。
    - 原因：便于生成变更日志、自动化发布与回滚策略，并提升协作一致性。

- plugins: ['commitlint-plugin-function-rules']
    - 说明：启用自定义函数规则插件，用来做动态校验（例如 scope 白名单检查）。
    - 原因：可以根据仓库状态（如 packages 列表）动态限制 scope，增强灵活性和正确性。

- prompt.alias / prompt.typesAppend / prompt.\*
    - 说明：配置 `cz-git` 的交互式提示别名与类型扩充，包含中英文注释位于注释块中（被注释的部分为可选）。
    - 原因：帮助开发者快速选择合适的 commit type，降低误提交概率，并保持提交信息规范。

- allowedScopes / scopeComplete
    - 说明：`allowedScopes` 基于 monorepo 的 packages 名称和一些通用 scope（如 style, lint 等）。 `scopeComplete` 通过读取 git 工作树尝试预填充当前修改的 scope。
    - 原因：提高提交时的便利性与准确性，避免随意填写非仓库相关 scope。

- rules:
    - 'body-leading-blank': [2, 'always']
        - 说明：要求 body 前有空行（error）。
        - 原因：保持 header 与 body 的可读性，方便自动解析 changelog。
    - 'footer-leading-blank': [1, 'always']
        - 说明：footer 前建议空行（warning）。
        - 原因：提高可读性并兼容一些解析工具的期望格式。
    - 'function-rules/scope-enum': 自定义函数
        - 说明：用函数校验 scope 是否在 allowedScopes 中。
        - 原因：Allows dynamic validation using workspace packages, preventing incorrect scopes.
    - 'header-max-length': [2, 'always', 108]
        - 说明：header 最大长度 108 字符（error）。
        - 原因：在保持信息完整的同时，避免过长的标题影响日志与显示。108 的选择折衷了英文与中文长度需求。
    - 'subject-empty' / 'type-empty' 等
        - 说明：确保 commit 包含 type 与 subject，不允许为空。
        - 原因：维持提交信息的最小结构化约束，便于后续自动化处理。
    - 'type-enum'
        - 说明：限制 type 为特定集合（feat, fix, perf, ...）。
        - 原因：统一团队约定，便于按类型筛选变更（如 release note 分组）。

---

## prettier-config/index.mjs

- endOfLine: 'auto'
    - 说明：使用系统默认换行（LF/CRLF 自动处理）。
    - 原因：跨平台项目（Windows / macOS / Linux）避免换行符引起的 diff 噪音。

- overrides: for '\*.json5' quoteProps: 'preserve', singleQuote: false
    - 说明：对 JSON5 文件保留属性引号并使用双引号。
    - 原因：JSON 格式通常使用双引号，保证与 JSON 语法和工具兼容。

- plugins: ['prettier-plugin-tailwindcss']
    - 说明：集成 Tailwind CSS 类名排序插件。
    - 原因：自动对 class 列表进行确定性排序，减少无意义的样式变动并提升可读性。

- printWidth: 120
    - 说明：每行最大长度 120 字符。
    - 原因：给现代宽屏编辑器更宽的视觉空间，兼顾可读性与代码行长度。

- proseWrap: 'never'
    - 说明：不对 Markdown 中的文字内容进行自动折行。
    - 原因：保留文本作者的意图与 diff 可读性，避免自动破坏文本结构。

- semi: true / singleQuote: true / trailingComma: 'all'
    - 说明：启用分号、使用单引号、保持尾随逗号。
    - 原因：符合团队编码风格，尾随逗号便利于多行 diff 时减少变更行数。

---

## stylelint-config/index.mjs

- extends: ['stylelint-config-standard', 'stylelint-config-recess-order']
    - 说明：以标准规则与声明顺序插件为基础。
    - 原因：保证 CSS/SCSS 基础校验并统一声明顺序提升可读性。

- ignoreFiles: '\*_/_.js, jsx, tsx, ts, json, md'
    - 说明：跳过非样式文件的检查。
    - 原因：这些文件不是纯样式文件，样式书写通常嵌入在模板或特定语法中，通过 overrides 处理。

- overrides: postcss-html / postcss-scss
    - 说明：为 `.vue` / `.html` 使用 `postcss-html`，为 `.scss` 使用 `postcss-scss` 并扩展推荐的 scss/vue 配置。
    - 原因：正确解析内联样式、模板中的 style 块与 SCSS 语法，避免误报。

- plugins: ['stylelint-order', '@stylistic/stylelint-plugin', 'stylelint-prettier', 'stylelint-scss']
    - 说明：引入声明顺序、风格化、prettier 集成和 SCSS 支持插件。
    - 原因：确保规则可组合、与 prettier 协同，以及对 SCSS 的增强校验。

- rules: (列举若干重点规则与原因)
    - 'at-rule-no-unknown' / 'scss/at-rule-no-unknown' -> ignoreAtRules: [...]
        - 说明：允许识别大量在构建或框架中常用的 at-rule（如 tailwind, include, mixin 等）。
        - 原因：这些 at-rule 在 postcss 或 scss 中合法，忽略可以避免误报。
    - 'order/order': 指定规则顺序
        - 说明：定义了 CSS 中不同块（变量、自定义属性、at-rules、声明、规则等）的顺序。
        - 原因：统一样式文件结构，提高可维护性和审阅效率。
    - 'prettier/prettier': true
        - 说明：启用 prettier 与 stylelint 的联动，由 prettier 负责格式化细节。
        - 原因：避免规则冲突，让 prettier 负责格式类校验，stylelint 负责语义类校验。
    - 'selector-class-pattern'
        - 说明：限定 class 名的命名模式（支持 BEM 与常用前缀如 o/c/u/t 等）。
        - 原因：强制一致的命名约定，便于大型项目协作与样式复用。

---

## eslint-config (internal/lint-configs/eslint-config)

总体说明：此包通过 `defineConfig` 异步组合多个子配置模块（如 vue, typescript, prettier 等），把复杂的 lint 规则拆分为可维护的子模块，最后汇总成 flat config。这样结构便于按需加载与复用。

- src/index.ts
    - defineConfig([...])
        - 说明：按固定顺序加载 `vue(), javascript(), ignores(), prettier(), typescript(), jsonc(), ...` 等配置。
        - 原因：顺序有讲究，例如先解析语言特性再应用 prettier 强制，某些插件需先注册才能生效；此外把 ignores 放在靠前的位置能避免不必要的规则应用。

- src/custom-config.ts
    - 说明：专门为 monorepo 各子包/目录定义的覆盖规则（files/ignores/rules），例如对 `packages/@core`、`apps`、`backend-mock`、`internal` 等有定制化规则。
    - 原因：monorepo 中不同包的约束不同——比如生成文件、后端 mock、内部脚本允许更多自由度；通过 `files` 精确控制，可以减少误报并保持一致性。
    - 关键点解释：
        - restrictedImportIgnores: 列出在某些文件中放宽 import 限制的文件（如 build 配置文件）。
        - 多处使用 `no-restricted-imports`：用于避免子包之间错误依赖（例如禁止 @core 引入 @vben），保证包边界清晰，防止循环或不正确的依赖结构。
        - 在 `apps/backend-mock/**` 和 `docs/**` 中关闭若干规则：这些目录通常为示例/测试/脚本，降低规则可以提高开发效率。

- src/configs/\*
    - 说明：configs 目录把各类规则按关注点拆分（command、comments、import、javascript、typescript、vue、prettier 等），每个模块负责自己的规则集合。
    - 原因：模块化便于维护与扩展，减少单一文件臃肿并能按需导出/测试。

- 与 prettier 的整合
    - 说明：prettier 模块被包含在 configs 中，保证格式化规则与 eslint 联动（prettier 通常要在 rules 或 plugin 中禁用与格式相关的规则）。
    - 原因：避免格式化规则与代码质量规则冲突，让 prettier 处理样式问题，eslint 侧重语义错误与最佳实践。

- perfectionist / unicorn / node / jsdoc 等插件
    - 说明：引入多个插件（如 perfectionist 用于排序/风格一致性，unicorn 提供更好的 JS/TS 建议，jsdoc 用于文档注释校验）。
    - 原因：通过插件生态补足 core eslint 的能力，提升代码质量与一致性。

---

## 建议与注意事项

- 若要把注释直接加回到配置源文件（作为 inline comment），我可以帮助逐文件修改并在每处配置上添加简短中文注释；但这会修改仓库文件。当前我已把集中注释保存在 `internal/lint-configs/ANNOTATIONS.md`，便于审阅。

- 推荐把 `ANNOTATIONS.md` 与 CI 或贡献指南链接，方便新成员快速了解配置意图。

- 若需要，我可以继续：
    - 逐文件插入 inline 注释并提交 PR。
    - 为每个子配置生成更细粒度的解释（例如把 eslint rule 的解释展开到单条规则）。

---

文档生成于仓库 `internal/lint-configs`，如需将注释写入原始配置文件或生成 PR，请告诉我下一步。
