# Packages 导出关系分析报告

生成时间：2026-01-10  
项目：vben-monorepo  
版本：5.5.9

---

## 📊 Packages 依赖关系矩阵

### 当前 Packages 清单

```
packages/
├── @core/
│   ├── base/              [无 package.json]
│   ├── composables/       [@vben-core/shared, @vben-core/typings]
│   ├── preferences/       [@vben-core/typings]
│   └── ui-kit/            [无 package.json]
├── constants/             [@vben-core/shared]
├── effects/               [vue, vue-router, pinia, @vben-core/*]
├── icons/                 [@vben-core/icons]
├── locales/               [vue, vue-i18n, @vben-core/composables]
├── preferences/           [@vben-core/preferences, @vben-core/typings]
├── stores/                [vue, vue-router, pinia, @vben-core/*, @vben/*]
├── styles/                [@vben-core/design]
├── types/                 [vue, vue-router, @vben-core/typings]
└── utils/                 [vue-router, @vben-core/*]
```

---

## 🔗 详细导出关系

### 1. constants (导出关系最简)

**导出内容：**
- `./core.ts` - 核心常量
- `@vben-core/shared/constants` - 共享常量

**依赖：**
```json
{
  "@vben-core/shared": "workspace:*"
}
```

**特点：** ✓ 通用包

---

### 2. types (类型定义)

**导出内容：**
```typescript
export type * from "./user";                    // UserInfo 等
export type * from "@vben-core/typings";       // 核心类型
```

**导出子路径：**
- `.`: 主入口 (user 类型)
- `./global`: `global.d.ts` (全局类型)

**依赖：**
```json
{
  "vue": "catalog:",
  "vue-router": "catalog:",
  "@vben-core/typings": "workspace:*"
}
```

**特点：** ⚠️ 混合包 (有 Vue/Router 依赖，但仅用于类型)

---

### 3. icons (图标库)

**导出内容：**
- `./iconify.ts` - Iconify 相关
- `./icons/empty-icon.vue` - Vue 组件
- `./svg.ts` - SVG 图标

**依赖：**
```json
{
  "@vben-core/icons": "workspace:*"
}
```

**特点：** ✓ 通用包

---

### 4. styles (样式库)

**导出内容：**
```typescript
import "@vben-core/design";
```

**导出子路径：**
- `.`: 主入口
- `./antd`: Ant Design 样式
- `./ele`: Element Plus 样式
- `./naive`: Naive UI 样式
- `./global`: 全局样式

**依赖：**
```json
{
  "@vben-core/design": "workspace:*"
}
```

**特点：** ✓ 通用包

---

### 5. preferences (用户偏好设置)

**导出内容：**
```typescript
function defineOverridesPreferences(preferences: DeepPartial<Preferences>)

export * from "@vben-core/preferences";
```

**依赖：**
```json
{
  "@vben-core/preferences": "workspace:*",
  "@vben-core/typings": "workspace:*"
}
```

**特点：** ✓ 通用包 (仅类型依赖)

---

### 6. utils (工具函数)

**导出内容：**
```typescript
export * from "./helpers";
export * from "@vben-core/shared/cache";
export * from "@vben-core/shared/color";
export * from "@vben-core/shared/utils";
```

**子目录：**
- `helpers/` - 路由、菜单、访问控制相关工具函数

**依赖：**
```json
{
  "vue-router": "catalog:",
  "@vben-core/shared": "workspace:*",
  "@vben-core/typings": "workspace:*"
}
```

**特点：** ⚠️ 混合包
- 通用部分：`helpers/cache.ts`, `helpers/color.ts` 等
- Vue Router 相关：`helpers/generate-routes.ts`, `helpers/reset-static-routes.ts`

---

### 7. stores (Pinia 状态管理)

**导出内容：**
```typescript
export * from "./modules";
export * from "./setup";
export { defineStore, storeToRefs } from "pinia";
```

**模块清单：**
- `modules/access.ts` - 访问控制 store
- `modules/tabbar.ts` - 标签栏 store
- `modules/timezone.ts` - 时区 store
- `modules/user.ts` - 用户信息 store

**依赖：**
```json
{
  "vue": "catalog:",
  "vue-router": "catalog:",
  "pinia": "catalog:",
  "pinia-plugin-persistedstate": "catalog:",
  "secure-ls": "catalog:",
  "@vben-core/preferences": "workspace:*",
  "@vben-core/shared": "workspace:*",
  "@vben-core/typings": "workspace:*"
}
```

**特点：** ✗ Vue3 专用包

---

### 8. locales (多语言)

**导出内容：**
```typescript
export { setupI18n, i18n, loadLocaleMessages, ... }
export type { LocaleSetupOptions, ... }
export { useI18n }
```

**依赖：**
```json
{
  "vue": "catalog:",
  "vue-i18n": "catalog:",
  "@vben-core/composables": "workspace:*"
}
```

**特点：** ✗ Vue3 专用包

---

### 9. effects (业务逻辑层)

**子目录及导出：**
```
effects/
├── access/          - 访问控制 hooks
├── common-ui/       - 通用 UI 组件
├── hooks/           - Vue3 组合函数 hooks (包括 use-tabs, use-refresh 等)
├── layouts/         - 布局组件
├── plugins/         - Vue 插件
├── request/         - 请求工具
```

**主要依赖：**
```json
{
  "vue": "catalog:",
  "vue-router": "catalog:",
  "pinia": "catalog:",
  "@vben/stores": "workspace:*",
  "@vben/utils": "workspace:*",
  "@vben-core/composables": "workspace:*"
}
```

**特点：** ✗ Vue3 专用包

---

## 📦 依赖关系图

### 按依赖深度排序

```
Level 0 (无依赖 - 通用基础)
├── constants
├── icons
├── styles
└── preferences

Level 1 (仅依赖 Level 0)
├── types
└── utils (部分混合)

Level 2 (依赖 Level 0-1)
├── stores
├── locales
└── effects
```

### 跨包依赖关系

```
constants  ← 被依赖方: (无其他包依赖)
types      ← 被依赖方: (无其他包依赖)
icons      ← 被依赖方: (无其他包依赖)
styles     ← 被依赖方: (无其他包依赖)
preferences← 被依赖方: (无其他包依赖)
utils      ← 被依赖方: stores, effects
stores     ← 被依赖方: effects
locales    ← 被依赖方: effects
```

---

## 🎯 Package.json 统计

### 所有包版本号

| 包名 | 当前版本 | 发布类型 | 说明 |
|------|---------|---------|------|
| @vben/constants | 5.5.9 | workspace:* | 通用 |
| @vben/types | 5.5.9 | workspace:* | 通用 |
| @vben/icons | 5.5.9 | workspace:* | 通用 |
| @vben/styles | 5.5.9 | workspace:* | 通用 |
| @vben/preferences | 5.5.9 | workspace:* | 通用 |
| @vben/utils | 5.5.9 | workspace:* | Vue3 |
| @vben/stores | 5.5.9 | workspace:* | Vue3 |
| @vben/locales | 5.5.9 | workspace:* | Vue3 |
| @vben/effects | 5.5.9 | workspace:* | Vue3 |

### 框架依赖版本

| 框架 | 使用包 | 说明 |
|------|--------|------|
| Vue 3 | vue: catalog: | 大多数包 |
| Vue Router 4 | vue-router: catalog: | utils, stores, effects |
| Pinia | pinia: catalog: | stores, effects |
| Vue i18n | vue-i18n: catalog: | locales |

---

## ✅ 拆分后的导入更新映射表

### 迁移前 → 迁移后

**Common 包：**
```typescript
// 迁移前
import { LOGIN_PATH } from '@vben/constants'
import type { UserInfo } from '@vben/types'
import { EmptyIcon } from '@vben/icons'
import '@vben/styles/antd'
import { defineOverridesPreferences } from '@vben/preferences'

// 迁移后
import { LOGIN_PATH } from '@vben/common/constants'
import type { UserInfo } from '@vben/common/types'
import { EmptyIcon } from '@vben/common/icons'
import '@vben/common/styles/antd'
import { defineOverridesPreferences } from '@vben/common/preferences'
```

**Vue3 包：**
```typescript
// 迁移前
import { generateMenus, resetStaticRoutes } from '@vben/utils'
import { useTabbarStore } from '@vben/stores'
import { setupI18n } from '@vben/locales'
import { useNavigation } from '@vben/effects'

// 迁移后
import { generateMenus, resetStaticRoutes } from '@vben/vue3/utils'
import { useTabbarStore } from '@vben/vue3/stores'
import { setupI18n } from '@vben/vue3/locales'
import { useNavigation } from '@vben/vue3/effects'
```

---

## 🚨 注意事项

### 1. 循环依赖风险 ⚠️

**当前无循环依赖**，但需注意：
- `effects` 依赖 `stores`，`stores` 不能依赖 `effects`
- 保持单向依赖关系

### 2. 跨包导入风险 ⚠️

某些包导出了内部模块的子路径：
```typescript
// ❌ 不建议
import { useTabbarStore } from '@vben/stores/modules/tabbar'

// ✓ 建议
import { useTabbarStore } from '@vben/stores'
```

### 3. 框架耦合 ⚠️

- `utils` 中的 router 相关函数与 Vue Router 耦合
- `effects` 高度依赖 Vue 3 的 Composition API

---

## 📋 拆分完成后的包结构预期

```
packages/
├── common/
│   ├── constants/
│   ├── types/
│   ├── icons/
│   ├── styles/
│   └── preferences/
├── vue3/
│   ├── composables/
│   ├── utils/
│   ├── locales/
│   ├── stores/
│   └── effects/
├── vue2/
│   ├── stores/
│   ├── composables/
│   └── effects/
├── uniapp/
│   ├── stores/
│   ├── composables/
│   └── effects/
└── miniprogram/
    ├── stores/
    ├── composables/
    └── effects/
```

---

## 总结

✅ **通用包** (5 个): constants, types, icons, styles, preferences
- 无框架依赖，可被所有版本复用

⚠️ **混合包** (2 个): utils, types
- 部分通用，部分 Vue3 专用
- 需要拆分

✗ **Vue3 专用包** (4 个): locales, stores, effects, @core/composables
- 深度依赖 Vue 3
- 迁移到 vue3 目录

**建议拆分优先级:**
1. Level 0 (通用包) - 直接迁移
2. Level 1 (混合包) - 拆分后迁移
3. Level 2 (Vue3 包) - 更新导入后迁移

