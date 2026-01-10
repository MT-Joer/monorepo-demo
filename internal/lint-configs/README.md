# Lint Configs

## 概述

`lint-configs` 是一个工具包，为整个 Vben 项目提供统一的代码质量、风格和提交规范配置。包含 4 个子工具：

- **commitlint-config**: Commit 消息规范配置
- **eslint-config**: JavaScript/TypeScript 代码检验规则
- **prettier-config**: 代码格式化配置
- **stylelint-config**: CSS/SCSS 样式检验规则

---

## 1. commitlint-config

### 功能

强制执行 Conventional Commits 规范，规范化项目的 Git commit 消息，支持自动化变更日志和版本发布。

### 特性

- ✅ **Conventional Commits 基础**: 基于 `@commitlint/config-conventional` 标准
- ✅ **动态 Scope 生成**: 自动从 monorepo 包名生成有效的 scope 白名单
- ✅ **交互式提交提示**: 集成 cz-git，提供别名和默认值优化体验
- ✅ **自动 Scope 预填充**: 通过 Git 状态检测，智能预填充 scope

### 配置说明

#### Commit 类型 (type)

支持的 commit 类型：

| 类型 | 说明 |
|------|------|
| `feat` | 新增功能 |
| `fix` | 修复缺陷 |
| `perf` | 性能优化 |
| `style` | 代码格式 |
| `docs` | 文档变更 |
| `test` | 测试变更 |
| `refactor` | 代码重构 |
| `build` | 构建流程变更 |
| `ci` | CI/CD 配置变更 |
| `chore` | 工具链或配置变更 |
| `revert` | 回滚提交 |
| `types` | 类型定义文件修改 |
| `release` | 版本发布 |

#### Scope 范围

有效的 scope 包括：
- 所有 monorepo 包名（如 `@vben/xxx`）
- 预定义 scopes: `project`、`style`、`lint`、`ci`、`dev`、`deploy`、`other`

#### Commit 消息格式

```
<type>[<scope>]: <subject>

<body>

<footer>
```

**规则**:
- `type` 和 `subject` 必填
- `subject` 最长 108 字符
- `body` 和 `footer` 可选

### 使用示例

#### 交互式提交

```bash
pnpm commit
```

#### 快速提交（使用别名）

```bash
# 修复拼写错误
pnpm commit :f

# 更新依赖
pnpm commit :b

# 更新配置
pnpm commit :c

# 更新代码格式
pnpm commit :s

# 更新 README
pnpm commit :r
```

#### 标准 Git 提交

```bash
git commit -m "feat(button): add loading state"
git commit -m "fix(modal): close on outside click"
git commit -m "docs(api): update endpoint documentation"
```

### 文件位置

- **主配置**: `index.mjs`
- **依赖**: `@vben/node-utils`（用于 monorepo 包检测）

---

## 2. eslint-config

### 功能

为 JavaScript、TypeScript、Vue、JSON 等多种文件格式提供完整的代码检验规则。

### 特性

- ✅ **多语言支持**: Vue、TypeScript、JavaScript、JSON、JSONC
- ✅ **插件集成**: 支持 30+ ESLint 插件
- ✅ **Monorepo 优化**: 自定义配置针对不同目录的导入限制
- ✅ **小程序支持**: 支持 WXML（微信小程序标签语言）

### 支持的文件类型

| 文件类型 | 解析器 | 说明 |
|---------|--------|------|
| `.js`, `.jsx` | JavaScript | JavaScript 文件 |
| `.ts`, `.tsx` | TypeScript | TypeScript 文件 |
| `.vue` | vue-eslint-parser + TypeScript | Vue 3 单文件组件 |
| `.json`, `.jsonc` | jsonc-eslint-parser | JSON 配置文件 |
| `.wxml` | wxml-eslint-parser | 微信小程序模板文件 |

### 主要规则分类

#### 1. Vue 规则 (`vue.ts`)
- 单文件组件解析和验证
- 模板语法检验
- 组件名称规范
- 属性绑定风格

#### 2. TypeScript 规则 (`typescript.ts`)
- 类型注解检验
- 接口定义规范
- Any 类型使用限制
- 成员访问修饰符

#### 3. JavaScript 规则 (`javascript.ts`)
- 变量声明规范
- 函数定义规范
- 循环和条件语句检验
- 原型链和继承检验

#### 4. 导入规则 (`import.ts`)
- 导入/导出规范
- 循环依赖检测
- 自动排序优化

#### 5. 代码风格 (`perfectionist.ts`)
- 属性排序
- 导入排序
- 对象键排序

#### 6. 注释规则 (`jsdoc.ts`)
- JSDoc 格式检验
- 参数说明完整性
- 返回值注解

#### 7. 其他规则
- **test.ts**: 测试文件专用规则（Vitest、Jest）
- **comments.ts**: ESLint 指令注释规范
- **jsonc.ts**: JSON 注释相关规则
- **node.ts**: Node.js 特定规则
- **unicorn.ts**: 通用最佳实践

### 自定义配置 (`custom-config`)

针对不同目录的覆盖配置：

```typescript
// 应用于特定目录
{
  files: ['apps/web/**/*.ts'],
  rules: {
    // 特定规则覆盖
  }
}
```

### 使用示例

#### 在项目中应用

```typescript
// eslint.config.mjs
import { defineConfig } from '@vben/eslint-config'

export default defineConfig([
  // 自定义规则覆盖
  {
    files: ['src/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off'
    }
  }
])
```

#### 扩展配置

```typescript
// 传入额外的配置
const config = await defineConfig([
  {
    // 自定义规则
  }
])
```

### 文件结构

```
eslint-config/
├── src/
│   ├── configs/          # 各类型配置
│   │   ├── vue.ts
│   │   ├── typescript.ts
│   │   ├── javascript.ts
│   │   ├── import.ts
│   │   ├── prettier.ts
│   │   ├── test.ts
│   │   └── ...
│   ├── custom-config/    # 目录特定覆盖
│   ├── index.ts          # 主导出
│   └── util.ts           # 工具函数
└── dist/                 # 构建输出
```

---

## 3. prettier-config

### 功能

提供统一的代码格式化配置，prettier 仅校验wxml文件. 其他文件使用eslint进行格式化

 [为什么我不用prettier?](https://antfu.me/posts/why-not-prettier-zh) - antfu > vue,vite 核心团队成员
### 配置参数

```javascript
{
  // 格式选项
  printWidth: 120,       // 一行最大字符数
  tabWidth: 4,           // 缩进空格数
  useTabs: true,         // 使用制表符而非空格
  semi: true,            // 语句末尾添加分号
  singleQuote: false,    // 使用双引号
  
  // HTML 处理
  htmlWhitespaceSensitivity: "ignore",  // 忽略 HTML 空白敏感性
  bracketSameLine: true,                 // 放置 JSX 右括号在同一行
  
  // 插件
  plugins: [
    "prettier-plugin-tailwindcss",      // Tailwind CSS 类排序
    "@venus/prettier-plugin-wxml"       // 微信小程序模板格式化
  ],
  
  // 覆盖配置
  overrides: [
    {
      files: ["*.json5"],
      options: {
        quoteProps: "preserve",
        singleQuote: false
      }
    },
    {
      files: ["*.wxml"],
      options: {
        parser: "wxml"
      }
    }
  ]
}
```

### 特性

- ✅ **Tab 缩进**: 项目统一使用 Tab 字符（4 字符宽度）
- ✅ **Tailwind CSS 支持**: 自动排序 Tailwind CSS 类名
- ✅ **WXML 支持**: 格式化微信小程序模板文件
- ✅ **JSON5 支持**: 保留 JSON5 中的注释

### 使用

```bash
# 格式化项目
prettier --write .

# 检查格式化
prettier --check .

# 仅格式化特定文件
prettier --write src/**/*.vue
```

### 文件位置

- **主配置**: `index.mjs`
- **插件**: `plugin/` 目录

---

## 4. stylelint-config

### 功能

提供 CSS、SCSS 和 Vue 单文件组件样式块的检验和格式化规则。

### 特性

- ✅ **多文件类型支持**: CSS、SCSS、Vue、HTML
- ✅ **SCSS 特性支持**: 变量、混合宏、嵌套等
- ✅ **CSS 声明顺序**: 通过 recess-order 插件强制合理的属性顺序
- ✅ **Tailwind CSS 兼容**: 支持 Tailwind 指令（@tailwind、@apply 等）
- ✅ **Vue 伪类支持**: :global、:deep、v-deep 等

### 配置说明

#### 支持的文件类型

| 文件类型 | 解析器 | 特性 |
|---------|--------|------|
| `.css` | 默认 | 标准 CSS |
| `.scss` | postcss-scss | SCSS 变量、混合宏、嵌套 |
| `.vue` | postcss-html | Vue 单文件组件样式块 |
| `.html` | postcss-html | HTML 内联样式 |

#### CSS 声明顺序

规则遵循 recess 顺序，优先级从高到低：

```
1. SCSS 变量 ($variable)
2. CSS 自定义属性 (--custom-prop)
3. @-rules (@media, @supports 等)
4. 普通声明 (color, width 等)
5. 嵌套规则 (& 选择器)
```

#### 支持的 @-rules

项目支持的特殊 @-rules：

| @-rule | 来源 | 用途 |
|--------|------|------|
| `@tailwind` | Tailwind CSS | 注入样式 |
| `@apply` | Tailwind CSS | 应用样式类 |
| `@variants` | Tailwind CSS | 定义变体 |
| `@mixin` | SCSS | 定义混合宏 |
| `@include` | SCSS | 包含混合宏 |
| `@extend` | SCSS | 扩展规则 |
| `@if/@else` | SCSS | 条件语句 |
| `@for/@each` | SCSS | 循环语句 |

#### Vue 伪类支持

```vue
<style scoped>
/* Vue 3 伪类 */
:global(.global-class) { }
:deep(.deep-class) { }
:slotted(.slot-class) { }

/* Vue 2 语法（仍支持） */
::v-deep { }
::v-global { }
::v-slotted { }
</style>
```

### 禁用的规则

为避免与 Prettier 冲突，以下规则被禁用或放宽：

| 规则 | 原因 |
|------|------|
| `at-rule-no-deprecated` | Tailwind 和 SCSS 需要灵活性 |
| `function-no-unknown` | SCSS 函数定义支持 |
| `no-descending-specificity` | 嵌套规则可能导致 |
| `no-empty-source` | 某些工作流生成空样式文件 |

### 使用示例

#### CSS 文件

```css
:root {
  --primary-color: #007bff;
  --secondary-color: #6c757d;
}

.button {
  background-color: var(--primary-color);
  border-radius: 4px;
  padding: 8px 16px;
}

@media (max-width: 768px) {
  .button {
    padding: 6px 12px;
  }
}
```

#### SCSS 文件

```scss
$primary-color: #007bff;

@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.button {
  @include flex-center;
  background-color: $primary-color;
  
  &:hover {
    opacity: 0.9;
  }
}
```

#### Vue 单文件组件

```vue
<template>
  <div class="container">
    <h1>Title</h1>
  </div>
</template>

<style scoped>
:global(.site-header) {
  background-color: #f5f5f5;
}

.container {
  padding: 20px;
  
  :deep(.inner-class) {
    color: red;
  }
}

@media (max-width: 768px) {
  .container {
    padding: 10px;
  }
}
</style>
```

#### Tailwind CSS

```vue
<style scoped>
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer components {
  .btn-primary {
    @apply px-4 py-2 bg-blue-500 text-white rounded;
  }
}
</style>
```

### 文件结构

```
stylelint-config/
├── src/
│   ├── config/           # 特定配置
│   │   ├── miniprogram.ts  # 小程序样式配置
│   │   └── ...
│   └── index.ts          # 主导出
└── dist/                 # 构建输出
```

---

## 集成使用

### 在 ESLint 中集成 Prettier

```javascript
// eslint.config.mjs
import { defineConfig } from '@vben/eslint-config'

export default defineConfig()
// prettier 规则已集成在 eslint-config 中
```

### 在 VSCode 中配置

```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "eslint.validate": ["javascript", "typescript", "vue"],
  "stylelint.enable": true
}
```

### 在 pre-commit hooks 中使用

```bash
# 使用 lefthook 或 husky
git add .
pnpm commit
```

---

## 最佳实践

1. **Commit 规范**: 始终使用 `pnpm commit` 而非 `git commit`，确保消息符合规范
2. **代码格式**: 保存时自动格式化，避免手动调整
3. **样式顺序**: 遵循 CSS 声明顺序，提高代码可读性
4. **TypeScript**: 启用严格模式，改进类型安全
5. **导入管理**: 让 ESLint 自动排序和整理导入

---

## 故障排除

### 问题：Commit 失败

**原因**: Commit 消息不符合规范  
**解决**: 使用 `pnpm commit` 交互式提交，或检查 scope 是否在允许列表中

### 问题：ESLint 报错过多

**原因**: 代码与规则不一致  
**解决**: 运行 `prettier --write .` 自动格式化，或在项目中覆写特定规则

### 问题：Stylelint 无法识别 Tailwind 指令

**原因**: 配置未加载 Tailwind 支持  
**解决**: 确保 `ignoreAtRules` 包含 `tailwind`、`apply` 等指令

---

## 参考资源

- [Conventional Commits](https://www.conventionalcommits.org/)
- [ESLint Documentation](https://eslint.org/)
- [Prettier Documentation](https://prettier.io/)
- [Stylelint Documentation](https://stylelint.io/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
