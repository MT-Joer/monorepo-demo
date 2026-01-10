# Packages 版本与依赖清单

生成时间：2026-01-10  
说明：为 packages 重组前做版本和依赖统计

---

## 📦 所有 Packages 版本统计

### Version: 5.5.9 (统一版本)

| 包名 | 版本 | 类型 | 路径 | 说明 |
|------|------|------|------|------|
| @vben/constants | 5.5.9 | workspace | packages/constants | 常量库 |
| @vben/types | 5.5.9 | workspace | packages/types | 类型定义 |
| @vben/icons | 5.5.9 | workspace | packages/icons | 图标库 |
| @vben/styles | 5.5.9 | workspace | packages/styles | 样式库 |
| @vben/preferences | 5.5.9 | workspace | packages/preferences | 偏好设置 |
| @vben/utils | 5.5.9 | workspace | packages/utils | 工具函数 |
| @vben/locales | 5.5.9 | workspace | packages/locales | 多语言 |
| @vben/stores | 5.5.9 | workspace | packages/stores | 状态管理 |
| @vben/effects | 5.5.9 | workspace | packages/effects | 业务逻辑 |

---

## 🔗 每个包的依赖清单

### 1. @vben/constants

```json
{
  "name": "@vben/constants",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/shared": "workspace:*"
  }
}
```

**通过 @vben-core/shared 间接依赖：**
- 常数定义

---

### 2. @vben/types

```json
{
  "name": "@vben/types",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/typings": "workspace:*",
    "vue": "catalog:",
    "vue-router": "catalog:"
  }
}
```

**注意：** vue 和 vue-router 仅用于类型定义，不是运行时依赖

---

### 3. @vben/icons

```json
{
  "name": "@vben/icons",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/icons": "workspace:*"
  }
}
```

**通过 @vben-core/icons 间接依赖：**
- 图标解析逻辑

---

### 4. @vben/styles

```json
{
  "name": "@vben/styles",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/design": "workspace:*"
  }
}
```

**通过 @vben-core/design 间接依赖：**
- 设计系统样式

---

### 5. @vben/preferences

```json
{
  "name": "@vben/preferences",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/preferences": "workspace:*",
    "@vben-core/typings": "workspace:*"
  }
}
```

---

### 6. @vben/utils

```json
{
  "name": "@vben/utils",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/shared": "workspace:*",
    "@vben-core/typings": "workspace:*",
    "vue-router": "catalog:"
  }
}
```

**vue-router 相关函数：**
- `helpers/generate-routes.ts`
- `helpers/reset-static-routes.ts`
- `helpers/generate-menus.ts`

---

### 7. @vben/locales

```json
{
  "name": "@vben/locales",
  "version": "5.5.9",
  "dependencies": {
    "@intlify/core-base": "catalog:",
    "@vben-core/composables": "workspace:*",
    "vue": "catalog:",
    "vue-i18n": "catalog:"
  }
}
```

**核心依赖：**
- vue (Composition API)
- vue-i18n (i18n 库)
- @vben-core/composables (通用 composables)

---

### 8. @vben/stores

```json
{
  "name": "@vben/stores",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/preferences": "workspace:*",
    "@vben-core/shared": "workspace:*",
    "@vben-core/typings": "workspace:*",
    "pinia": "catalog:",
    "pinia-plugin-persistedstate": "catalog:",
    "secure-ls": "catalog:",
    "vue": "catalog:",
    "vue-router": "catalog:"
  }
}
```

**核心依赖：**
- pinia (状态管理)
- pinia-plugin-persistedstate (持久化)
- secure-ls (加密本地存储)

---

### 9. @vben/effects

```json
{
  "name": "@vben/effects",
  "version": "5.5.9",
  "dependencies": {
    "@vben-core/composables": "workspace:*",
    "@vben/stores": "workspace:*",
    "@vben/utils": "workspace:*",
    "vue": "catalog:",
    "vue-router": "catalog:",
    "pinia": "catalog:"
  }
}
```

**核心依赖：**
- vue (Composition API)
- vue-router (路由)
- pinia (状态管理)
- @vben/stores (store hooks)
- @vben/utils (工具函数)

---

## 🔍 Catalog 版本映射 (pnpm catalog)

根据 `pnpm-workspace.yaml` 的 catalog 配置，这些是当前使用的版本：

### 框架版本

```yaml
vue: "^3.4.x"           # Vue 3
vue-router: "^4.3.x"    # Vue Router 4
pinia: "^2.1.x"         # Pinia 2
vue-i18n: "^9.x"        # Vue i18n 9
```

### 相关库版本

```yaml
pinia-plugin-persistedstate: "^2.x"
secure-ls: "^2.x"
@intlify/core-base: "^12.x"
```

---

## 📊 依赖关系统计表

### 工作空间内部依赖

| 包 | 依赖数量 | 被依赖数量 | 说明 |
|-----|---------|----------|------|
| constants | 1 (@vben-core/shared) | 0 | 通用基础 |
| types | 1 (@vben-core/typings) | 0 | 通用基础 |
| icons | 1 (@vben-core/icons) | 0 | 通用基础 |
| styles | 1 (@vben-core/design) | 0 | 通用基础 |
| preferences | 2 | 0 | 通用基础 |
| utils | 2 | 2 (stores, effects) | 工具层 |
| locales | 1 (@vben-core/composables) | 1 (effects) | Vue3 |
| stores | 3 | 1 (effects) | Vue3 |
| effects | 5 | 0 | Vue3 业务层 |

### NPM 外部依赖

| 依赖库 | 使用包 | 说明 |
|--------|--------|------|
| vue | types, locales, stores, effects | Vue 框架 |
| vue-router | types, utils, stores, effects | 路由库 |
| pinia | stores, effects | 状态管理 |
| vue-i18n | locales | 国际化 |
| pinia-plugin-persistedstate | stores | 持久化插件 |
| secure-ls | stores | 加密存储 |
| @intlify/core-base | locales | 国际化基础 |

---

## ✅ 拆分前检查清单

### 版本一致性
- [x] 所有包版本号：5.5.9 ✓
- [x] 所有内部依赖使用：workspace:* ✓
- [x] 所有外部依赖使用：catalog: ✓

### 依赖关系
- [x] 无循环依赖 ✓
- [x] 依赖关系清晰单向 ✓
- [x] 通用包无 Vue/Router 运行时依赖 ✓ (仅 types 有)

### 导出规范
- [x] 所有包有 package.json ✓
- [x] 所有包有 exports 字段 ✓
- [x] 所有包有 main/module 字段 ✓

---

## 🎯 拆分后版本规划

### 版本保持一致

```
common/*       → 5.5.9 (通用包，所有框架共用)
vue3/*         → 5.5.9 (Vue3 专用)
vue2/*         → 2.7.x (Vue2 专用，可独立版本)
uniapp/*       → 5.5.9 (UniApp 专用)
miniprogram/*  → 5.5.9 (小程序专用)
```

### 依赖调整规则

**Common 包依赖规则：**
```json
{
  "dependencies": {
    // ✓ 可以依赖 @vben-core/* 和其他 common/* 包
    // ❌ 禁止依赖：vue, vue-router, pinia, vue-i18n
  }
}
```

**Vue3 包依赖规则：**
```json
{
  "dependencies": {
    // ✓ 可以依赖 @vben/common/* 和 @vben/vue3/* 包
    // ✓ 可以依赖 vue, vue-router, pinia, vue-i18n
    // ❌ 禁止依赖：@vben/vue2/*, @vben/uniapp/*, @vben/miniprogram/*
  }
}
```

---

## 📝 拆分前最后确认

### 需要备份的关键文件

```
.git/                              # 版本历史
pnpm-workspace.yaml                # 工作空间配置
packages/*/package.json            # 所有包配置
packages/*/src/index.ts            # 导出清单
```

### 需要更新的配置文件

```
tsconfig.json                       # paths 映射
eslint.config.mjs                   # import 规则
.vscode/settings.json               # 工作区设置
PACKAGES_REORGANIZATION_PLAN.md     # 本计划（更新进度）
```

---

## ✨ 完成状态

| 任务 | 状态 | 完成时间 |
|------|------|---------|
| 分析 imports 关系 | ✅ 完成 | 2026-01-10 |
| 统计版本和依赖 | ✅ 完成 | 2026-01-10 |
| 版本控制备份 | ⏳ 待执行 | - |
| 创建 common 包 | ⏳ 待执行 | - |

---

**下一步：执行任务 3 - 版本控制备份**

