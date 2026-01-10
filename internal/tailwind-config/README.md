# Tailwind Config

## 概述

`@vben/tailwind-config` 是项目的 Tailwind CSS 配置包，提供统一的样式主题、颜色系统和自定义工具类。包括预配置的颜色调色板、动画、插件和 PostCSS 集成。

**版本**: 5.5.9  
**类型**: ES Module (ESM)  
**主入口**: `./dist/index.mjs`  
**配置文件**: `index.ts`、`postcss.config.ts`  

---

## 核心特性

✅ **预定义颜色系统**: shadcn/ui 颜色 + 自定义颜色  
✅ **动画和过渡**: 预定义动画及自定义进入动画  
✅ **图标支持**: 集成 Iconify 动态图标选择器  
✅ **PostCSS 集成**: 自动兼容性修复和 CSS 优化  
✅ **深色模式**: 支持选择器模式的深色主题  
✅ **多包支持**: 自动扫描 Monorepo 内所有包的模板文件  

---

## 配置结构

### 主配置文件 (index.ts)

#### 内容扫描

```typescript
content: [
  "./index.html",
  ...tailwindPackages.map(item =>
    path.join(item, "src/**/*.{vue,js,ts,jsx,tsx,svelte,astro,html}")
  ),
]
```

**功能**: 扫描所有 Monorepo 包的源文件以检测 Tailwind 类名

#### 深色模式

```typescript
darkMode: "selector"
```

**说明**: 使用 CSS 选择器模式（如 `.dark` 类）切换深色模式

---

## 颜色系统

### Shadcn/UI 颜色

基于 shadcn/ui 的标准颜色系统，支持 HSL 变量：

| 颜色 | 用途 | 说明 |
|------|------|------|
| `primary` | 主颜色 | 按钮、链接等主要元素 |
| `secondary` | 次要色 | 次要按钮、文本 |
| `accent` | 强调色 | 高对比度强调 |
| `destructive` | 危险色 | 删除、错误操作 |
| `success` | 成功色 | 成功提示 |
| `warning` | 警告色 | 警告提示 |
| `muted` | 静音色 | 禁用、不活跃元素 |
| `background` | 背景色 | 页面背景 |
| `foreground` | 前景色 | 文本默认颜色 |
| `card` | 卡片色 | 卡片背景 |
| `border` | 边框色 | 边框默认颜色 |
| `input` | 输入框色 | 输入框背景和边框 |
| `ring` | 焦点环 | 焦点环颜色 |

#### 使用示例

```vue
<template>
  <!-- 使用 Tailwind 类 -->
  <button class="bg-primary text-primary-foreground">主按钮</button>
  <button class="bg-destructive text-destructive-foreground">删除</button>
  <div class="border border-border bg-card text-card-foreground">卡片</div>
</template>

<style scoped>
.custom-element {
  /* 使用 CSS 变量 */
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
}
</style>
```

### 自定义颜色

项目还定义了额外的自定义颜色：

| 颜色 | 用途 |
|------|------|
| `red` | 红色调色板 |
| `green` | 绿色调色板 |
| `yellow` | 黄色调色板 |
| `primary` | 主题色调色板（50-700，包含变体） |
| `success` | 成功色调色板 |
| `warning` | 警告色调色板 |
| `sidebar` | 侧边栏背景 |
| `header` | 头部背景 |
| `main` | 主要背景 |
| `overlay` | 覆盖层 |
| `heavy` | 强调背景 |

#### 颜色值阶级

每个颜色调色板包含以下值（以 `primary` 为例）：

```typescript
{
  50: 'hsl(var(--primary-50))',        // 最浅
  100: 'hsl(var(--primary-100))',
  200: 'hsl(var(--primary-200))',
  300: 'hsl(var(--primary-300))',
  400: 'hsl(var(--primary-400))',
  500: 'hsl(var(--primary-500))',      // 标准色
  600: 'hsl(var(--primary-600))',
  700: 'hsl(var(--primary-700))',      // 最深
  
  // 语义变体
  'background-lightest': 'hsl(var(--primary-50))',
  'background-lighter': 'hsl(var(--primary-100))',
  'background-light': 'hsl(var(--primary-200))',
  'border-light': 'hsl(var(--primary-300))',
  'border': 'hsl(var(--primary-400))',
  'hover': 'hsl(var(--primary-600))',
  'active': 'hsl(var(--primary-700))',
  'text': 'hsl(var(--primary-500))',
  'text-hover': 'hsl(var(--primary-600))',
  'text-active': 'hsl(var(--primary-700))',
}
```

#### 使用示例

```html
<!-- 颜色阶级 -->
<div class="bg-primary-50">最浅背景</div>
<div class="bg-primary-100">浅色背景</div>
<div class="bg-primary-500">标准颜色</div>
<div class="bg-primary-700">深色背景</div>

<!-- 语义颜色 -->
<button class="bg-primary text-primary-foreground hover:bg-primary-hover">
  悬停效果
</button>

<!-- 深色模式 -->
<div class="dark:bg-primary-900 dark:text-primary-50">深色模式</div>
```

---

## 预定义动画

### 标准动画

| 动画 | 持续时间 | 说明 |
|------|---------|------|
| `accordion-down` | 200ms | 手风琴展开 |
| `accordion-up` | 200ms | 手风琴收起 |
| `collapsible-down` | 200ms | 可折叠展开 |
| `collapsible-up` | 200ms | 可折叠收起 |
| `float` | 5s | 浮动动画 |

#### 使用示例

```html
<div class="animate-accordion-down">展开内容</div>
<div class="animate-float">浮动元素</div>
```

### 进入动画（Enter Animation Plugin）

自定义进入动画，支持渐进式延迟显示（最多 5 个子元素）。

#### 类名

| 类名 | 说明 | 延迟 |
|------|------|------|
| `.enter-x:nth-child(1)` | 从右向左进入 | 0.1s |
| `.enter-x:nth-child(2)` | 从右向左进入 | 0.2s |
| `.enter-x:nth-child(n)` | 从右向左进入（n≤5） | n×0.1s |
| `.-enter-x:nth-child(n)` | 从左向右进入 | n×0.1s |
| `.enter-y:nth-child(n)` | 从下向上进入 | n×0.1s |
| `.-enter-y:nth-child(n)` | 从上向下进入 | n×0.1s |

#### 动画参数

- **持续时间**: 0.3s
- **缓动函数**: ease-in-out
- **初始状态**: opacity=0, transform=offset 50px
- **最终状态**: opacity=1, transform=translate(0)

#### 使用示例

```html
<div class="space-y-2">
  <div class="enter-x">第一项（延迟 0.1s）</div>
  <div class="enter-x">第二项（延迟 0.2s）</div>
  <div class="enter-x">第三项（延迟 0.3s）</div>
</div>

<!-- 从左向右进入 -->
<div class="space-y-2">
  <div class="-enter-x">从左进入</div>
  <div class="-enter-x">从左进入</div>
</div>

<!-- 竖直进入 -->
<div class="space-y-2">
  <div class="enter-y">从下向上</div>
  <div class="enter-y">从下向上</div>
</div>
```

---

## 插件

### 加载的插件

#### 1. Tailwind CSS Animate

提供标准过渡和动画类。

```typescript
import animate from "tailwindcss-animate"
```

#### 2. Tailwind CSS Typography

提供 `prose` 类族用于排版。

```typescript
import typographyPlugin from "@tailwindcss/typography"
```

**使用**:
```html
<article class="prose prose-lg">
  <h1>文章标题</h1>
  <p>文章内容...</p>
</article>
```

#### 3. Iconify Dynamic Icons

集成 Iconify 图标库，动态选择器支持。

```typescript
import { addDynamicIconSelectors } from "@iconify/tailwind"
```

**使用**:
```html
<!-- 动态图标 -->
<div class="icon-[mdi:home]"></div>
<div class="icon-[carbon:add]"></div>
```

#### 4. Enter Animation Plugin

自定义进入动画插件（见上文）。

```typescript
import { enterAnimationPlugin } from "./plugins/entry"
```

---

## 主题扩展

### 容器

```typescript
container: {
  center: true,       // 容器居中
  padding: "2rem",    // 默认内边距
  screens: {
    "2xl": "1400px"   // 2xl 断点
  }
}
```

**使用**:
```html
<div class="container mx-auto">
  <!-- 最大宽度 1400px，自动居中 -->
</div>
```

### 边框半径

| 类 | 值 |
|----|-----|
| `rounded-sm` | `calc(var(--radius) - 4px)` |
| `rounded-md` | `calc(var(--radius) - 2px)` |
| `rounded-lg` | `var(--radius)` |
| `rounded-xl` | `calc(var(--radius) + 4px)` |

### 盒阴影

```typescript
boxShadow: {
  float: `0 6px 16px 0 rgb(0 0 0 / 8%),
          0 3px 6px -4px rgb(0 0 0 / 12%),
          0 9px 28px 8px rgb(0 0 0 / 5%)`
}
```

**使用**:
```html
<div class="shadow-float">浮动阴影</div>
```

### Z-index 扩展

```typescript
zIndex: {
  "100": "100",
  "1000": "1000"
}
```

### 字体族

```typescript
fontFamily: {
  sans: ["var(--font-family)"]  // CSS 变量定义
}
```

---

## PostCSS 配置

### postcss.config.ts

```typescript
export default {
  plugins: {
    // 生产环境使用 cssnano 压缩
    ...(process.env.NODE_ENV === "production" ? { cssnano: {} } : {}),
    
    "postcss-import": {},           // 处理 @import
    "tailwindcss/nesting": {},      // SCSS-like 嵌套
    "postcss-preset-env": {},       // 浏览器兼容性
    tailwindcss: { config },        // Tailwind CSS
    autoprefixer: {},               // 自动前缀
    "postcss-antd-fixes": {         // Ant Design 兼容性
      prefixes: ["ant", "el"]
    }
  }
}
```

#### 插件说明

| 插件 | 功能 |
|------|------|
| `cssnano` | CSS 压缩优化（生产环保) |
| `postcss-import` | 处理 CSS @import 指令 |
| `tailwindcss/nesting` | 支持 CSS 嵌套语法 |
| `postcss-preset-env` | CSS 新特性和浏览器兼容性 |
| `tailwindcss` | 核心 Tailwind 处理 |
| `autoprefixer` | 添加浏览器厂商前缀 |
| `postcss-antd-fixes` | 修复 Ant Design 和 Element Plus 样式冲突 |

---

## 使用示例

### 基础样式

```vue
<template>
  <div class="min-h-screen bg-background">
    <header class="border-b border-border bg-header">
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-3xl font-bold text-foreground">应用标题</h1>
      </div>
    </header>
    
    <main class="container mx-auto px-4 py-8">
      <card class="rounded-lg border border-border bg-card p-6 shadow-md">
        <h2 class="text-2xl font-semibold text-foreground">卡片标题</h2>
        <p class="mt-2 text-muted-foreground">卡片内容</p>
      </card>
    </main>
  </div>
</template>
```

### 主题颜色

```vue
<template>
  <!-- 按钮 -->
  <button class="rounded bg-primary px-4 py-2 text-primary-foreground hover:bg-primary-600">
    主按钮
  </button>
  
  <!-- 危险操作 -->
  <button class="rounded bg-destructive px-4 py-2 text-destructive-foreground">
    删除
  </button>
  
  <!-- 深色模式 -->
  <div class="dark:bg-primary-900 dark:text-primary-50">
    深色模式内容
  </div>
</template>
```

### 进入动画

```vue
<template>
  <div class="space-y-4">
    <!-- 列表项依次进入 -->
    <div class="enter-x">项目 1</div>
    <div class="enter-x">项目 2</div>
    <div class="enter-x">项目 3</div>
    <div class="enter-x">项目 4</div>
    <div class="enter-x">项目 5</div>
  </div>
  
  <!-- 竖直进入 -->
  <div class="space-y-2 mt-8">
    <div class="enter-y">第一项</div>
    <div class="enter-y">第二项</div>
  </div>
</template>

<style scoped>
/* 初始不可见 */
.enter-x:nth-child(1),
.enter-y:nth-child(1) {
  opacity: 0;
}
</style>
```

### 图标集成

```html
<!-- Iconify 图标 -->
<i class="icon-[mdi:account] text-lg"></i>
<i class="icon-[carbon:search] text-xl"></i>
<i class="icon-[feather:heart] text-red-500"></i>
```

### 响应式设计

```html
<!-- 断点响应 -->
<div class="text-sm md:text-base lg:text-lg">
  响应式文本大小
</div>

<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <div>卡片 1</div>
  <div>卡片 2</div>
  <div>卡片 3</div>
</div>
```

---

## CSS 变量

项目通过 CSS 变量定义颜色，便于动态切换主题。

### 定义位置

通常在根 CSS 文件中定义：

```css
:root {
  /* 主颜色 */
  --primary: 220 90% 56%;
  --primary-foreground: 0 0% 100%;
  --primary-50: 220 100% 95%;
  --primary-100: 220 100% 90%;
  /* ... 更多变量 */
}

@media (prefers-color-scheme: dark) {
  :root {
    /* 深色主题变量 */
    --primary: 220 90% 46%;
    /* ... */
  }
}

.dark {
  /* 或使用选择器模式 */
  --primary: 220 90% 46%;
  /* ... */
}
```

### 使用示例

```vue
<script setup>
// 动态切换主题
const toggleTheme = () => {
  document.documentElement.classList.toggle('dark');
}
</script>

<template>
  <div class="bg-primary text-primary-foreground">
    <button @click="toggleTheme">切换主题</button>
  </div>
</template>
```

---

## 最佳实践

1. **使用语义颜色**: 优先使用 `primary`、`success`、`warning` 等语义颜色，而非直接使用 RGB 颜色
2. **响应式优先**: 使用 Tailwind 的响应式前缀（`md:`、`lg:` 等）而非媒体查询
3. **动画性能**: 使用 `transform` 和 `opacity` 实现动画，避免改变 `width`/`height`
4. **深色模式**: 使用 `dark:` 前缀为深色模式提供样式
5. **自定义插件**: 需要更多功能时，在 `plugins/` 目录创建新插件

---

## 故障排除

### 问题：Tailwind 类未生效

**原因**: 文件未包含在 `content` 配置中  
**解决**: 检查 `index.ts` 的 `content` 配置，确保覆盖所有源文件

### 问题：颜色未显示

**原因**: CSS 变量未定义  
**解决**: 在全局 CSS 中定义对应的 CSS 变量

### 问题：Ant Design 样式冲突

**原因**: Tailwind 和 Ant Design 选择器冲突  
**解决**: `postcss-antd-fixes` 已自动处理，确保其在配置中启用

---

## 参考资源

- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Tailwind CSS Animation](https://tailwindcss.com/docs/animation)
- [Tailwind CSS Typography](https://tailwindcss.com/docs/typography-plugin)
- [Iconify](https://iconify.design/)
- [shadcn/ui](https://ui.shadcn.com/)
