# Packages 结构重组计划表

## 📊 当前 Packages 分析

### 现有包及依赖关系

```
packages/
├── @core/
│   ├── base/
│   ├── composables/
│   ├── preferences/
│   └── ui-kit/
├── constants/          (依赖: @vben-core/shared)
├── effects/            (多个子目录：hooks, layouts, plugins, request, common-ui, access)
├── icons/              (依赖: @vben-core/icons)
├── locales/            (依赖: vue, vue-i18n, @vben-core/composables)
├── preferences/        (独立)
├── stores/             (依赖: vue, vue-router, pinia, @vben-core/*)
├── styles/             (独立 - 纯样式)
├── types/              (依赖: vue, vue-router) - 包含 user.ts
└── utils/              (依赖: vue-router, @vben-core/*)
```

### 依赖关系分析

| 包名 | Vue 依赖 | Router 依赖 | Pinia 依赖 | i18n 依赖 | 说明 |
|------|---------|-----------|----------|---------|------|
| constants | ❌ | ❌ | ❌ | ❌ | ✓ 通用 |
| types | ✓ | ✓ | ❌ | ❌ | ✓ 通用 |
| icons | ❌ | ❌ | ❌ | ❌ | ✓ 通用 |
| styles | ❌ | ❌ | ❌ | ❌ | ✓ 通用 |
| preferences | ❌ | ❌ | ❌ | ❌ | ✓ 通用 |
| utils | ✓ | ✓ | ❌ | ❌ | ⚠️ 混合 |
| locales | ✓ | ❌ | ❌ | ✓ | ⚠️ 混合 |
| stores | ✓ | ✓ | ✓ | ❌ | ✗ Vue3专用 |
| effects | ✓ | ✓ | ✓ | ❌ | ✗ Vue3专用 |

---

## 🎯 重组目标

将 packages 按以下结构重组，分别为不同框架提供支持：

```
packages/
├── common/                    ⭐ 通用包 (Vue版本无关)
│   ├── constants/            (现有 constants)
│   ├── types/                (现有 types)
│   ├── icons/                (现有 icons)
│   ├── styles/               (现有 styles)
│   └── preferences/          (现有 preferences)
├── vue3/                      ⭐ Vue3 专用包
│   ├── composables/          (现有 @core/composables)
│   ├── utils/                (现有 utils + 拆分后的部分)
│   ├── locales/              (现有 locales)
│   ├── stores/               (现有 stores)
│   └── effects/              (现有 effects)
├── vue2/                      ⭐ Vue2 专用包 (待创建)
│   ├── stores/               (Vuex 或 Pinia for Vue2)
│   ├── composables/          (对标 Vue3 composition API)
│   └── effects/              (Vue2 版本的 effects)
├── uniapp/                    ⭐ UniApp 专用包 (待创建)
│   ├── stores/               (adapted for UniApp)
│   ├── effects/              (adapted for UniApp)
│   └── composables/          (adapted for UniApp)
└── miniprogram/               ⭐ 小程序专用包 (待创建)
    ├── stores/               (WeChat/Alipay 小程序)
    ├── effects/              (adapted for miniprogram)
    └── composables/          (adapted for miniprogram)
```

---

## 📋 详细拆分计划

### Phase 1: 创建 Common 通用包

| 当前包 | 目标位置 | 修改 | 说明 |
|--------|---------|------|------|
| constants | common/constants | ✓ 移动 | 无框架依赖，直接移动 |
| styles | common/styles | ✓ 移动 | 无框架依赖，直接移动 |
| icons | common/icons | ✓ 移动 | 无框架依赖，直接移动 |
| preferences | common/preferences | ✓ 移动 | 无框架依赖，直接移动 |
| types | common/types | ⚠️ 拆分 | 抽取通用 types，Vue 特定 types 保留或移到 vue3 |

### Phase 2: 整理 Vue3 专用包

| 当前包 | 目标位置 | 修改 | 说明 |
|--------|---------|------|------|
| @core/composables | vue3/composables | ✓ 移动 | 更新导入路径 |
| utils | vue3/utils | ⚠️ 拆分 | 分离 router 相关逻辑，通用部分独立 |
| locales | vue3/locales | ✓ 移动 | 更新导入路径 |
| stores | vue3/stores | ✓ 移动 | 更新导入路径 |
| effects | vue3/effects | ✓ 移动 | 更新导入路径 |

### Phase 3: 创建 Vue2 专用包

| 包名 | 源 | 说明 |
|------|-----|------|
| vue2/stores | ❌ 新建 | Vuex 2 或 Pinia for Vue 2 版本 |
| vue2/composables | ❌ 新建 | 基于 @vue/composition-api |
| vue2/effects | ❌ 新建 | Vue2 版本的布局、hooks 等 |

### Phase 4: 创建 UniApp 专用包

| 包名 | 源 | 说明 |
|------|-----|------|
| uniapp/stores | ❌ 新建 | 适配 UniApp 的状态管理 |
| uniapp/composables | ❌ 新建 | 适配 UniApp 的组合函数 |
| uniapp/effects | ❌ 新建 | 适配 UniApp 的业务逻辑 |

### Phase 5: 创建小程序专用包

| 包名 | 源 | 说明 |
|------|-----|------|
| miniprogram/stores | ❌ 新建 | 适配微信/支付宝小程序 |
| miniprogram/composables | ❌ 新建 | 适配小程序的组合函数 |
| miniprogram/effects | ❌ 新建 | 适配小程序的业务逻辑 |

---

## 🔍 utils 包拆分详情

### 当前 utils 包内容
- `helpers/` - 通用工具函数（generateMenus, generate-routes等）
- Vue Router 相关函数（resetStaticRoutes等）

### 拆分方案

```
packages/utils/src/
├── helpers/
│   ├── generate-menus.ts        → common/utils 或 vue3/utils
│   ├── generate-routes.ts       → vue3/utils
│   ├── xxx-helper.ts            → 分类判断
│   └── ...
└── (router 相关)               → vue3/utils
```

**通用部分** → common/utils
- 与框架无关的辅助函数

**Vue3 部分** → vue3/utils
- route-router 相关
- menu 生成相关
- access 控制相关

---

## 📦 Package.json 依赖调整

### common/* 包依赖规则
```json
{
  "dependencies": {
    // ❌ 不引入：vue, vue-router, pinia, vue-i18n
    // ✓ 可引入：@vben-core/*, 工具库
  }
}
```

### vue3/* 包依赖规则
```json
{
  "dependencies": {
    // ✓ 引入：vue, vue-router, pinia, vue-i18n
    // ✓ 引入：@vben/common/*
    // ❌ 不引入：@vben/vue2/*, @vben/uniapp/*, @vben/miniprogram/*
  }
}
```

### vue2/* 包依赖规则
```json
{
  "dependencies": {
    // ✓ 引入：vue@2, vuex 或 pinia, @vue/composition-api
    // ✓ 引入：@vben/common/*
    // ❌ 不引入：vue@3, vue-router@4
  }
}
```

---

## 🚀 迁移步骤

### Step 1: 准备工作
- [ ] 列出所有当前 packages 的导出 (import 关系)
- [ ] 整理各 package.json 依赖版本
- [ ] 新建 common/, vue3/, vue2/, uniapp/, miniprogram/ 目录

### Step 2: 迁移 Common 包
- [ ] 移动 constants/ → common/constants/
- [ ] 移动 styles/ → common/styles/
- [ ] 移动 icons/ → common/icons/
- [ ] 移动 preferences/ → common/preferences/
- [ ] 拆分并移动 types/ → common/types/
- [ ] 更新所有相关 import 路径

### Step 3: 迁移 Vue3 包
- [ ] 移动 @core/composables/ → vue3/composables/
- [ ] 移动 locales/ → vue3/locales/
- [ ] 移动 stores/ → vue3/stores/
- [ ] 移动 effects/ → vue3/effects/
- [ ] 拆分 utils/ → vue3/utils/ + common/utils
- [ ] 更新导入路径 (common/* 优先级)

### Step 4: 创建 Vue2 包
- [ ] 新建 vue2/stores/
- [ ] 新建 vue2/composables/
- [ ] 新建 vue2/effects/
- [ ] 参考 Vue3 版本进行开发

### Step 5: 创建 UniApp 包
- [ ] 新建 uniapp/stores/
- [ ] 新建 uniapp/composables/
- [ ] 新建 uniapp/effects/

### Step 6: 创建小程序包
- [ ] 新建 miniprogram/stores/
- [ ] 新建 miniprogram/composables/
- [ ] 新建 miniprogram/effects/

### Step 7: 更新应用导入
- [ ] 更新 apps/web/ 导入路径 → @vben/vue3/*
- [ ] 更新 apps/uniapp/ 导入路径 → @vben/uniapp/*
- [ ] 更新 apps/miniprogram/ 导入路径 → @vben/miniprogram/*

### Step 8: 测试与验证
- [ ] 单元测试通过
- [ ] 类型检查通过
- [ ] 构建成功
- [ ] 应用运行正常

---

## 💡 特殊考虑

### 1. types/user.ts 处理
- **选项 A**: 移到 common/types (推荐)
- **选项 B**: 各框架版本 (vue3/types/user.ts, vue2/types/user.ts等)

### 2. @core/* 处理
- @core/base - UI 基础组件，保留（或并入 @vben/ui-kit）
- @core/composables - 迁移到 vue3/composables
- @core/preferences - 迁移到 common/preferences
- @core/ui-kit - 单独保留或整合

### 3. Effects 下各子目录
```
effects/
├── access/          → vue3/effects/access
├── common-ui/       → vue3/effects/common-ui (UI 组件)
├── hooks/           → vue3/composables (重命名并整合)
├── layouts/         → vue3/effects/layouts
├── plugins/         → vue3/effects/plugins
└── request/         → vue3/effects/request
```

### 4. 版本管理
```
package.json version: 5.5.9

common/*      → 5.5.9
vue3/*        → 5.5.9
vue2/*        → 2.x.x  (可选：独立版本号)
uniapp/*      → 5.5.9
miniprogram/* → 5.5.9
```

---

## 📊 预期收益

| 方面 | 改进 | 说明 |
|------|------|------|
| **清晰度** | +++  | 框架适配一目了然 |
| **复用** | +++  | common 包可被所有框架使用 |
| **维护** | ++   | 减少版本混淆 |
| **性能** | +    | 可选择性加载框架特定包 |
| **扩展** | +++  | 添加新框架支持更简单 |

---

## ⚠️ 潜在风险

| 风险 | 等级 | 缓解方案 |
|------|------|---------|
| 导入路径大规模变更 | 🔴 高 | 逐步迁移，提供迁移指南 |
| 循环依赖 | 🔴 高 | 严格遵守依赖规则 |
| 文档不同步 | 🟡 中 | 自动化文档生成 |
| 测试覆盖不足 | 🔴 高 | 补充测试用例 |

---

## ✅ 成功标准

- [ ] 所有包无循环依赖
- [ ] 各框架包独立可用
- [ ] 导入路径清晰 (@vben/common/*, @vben/vue3/*, 等)
- [ ] 所有单元测试通过
- [ ] 类型检查无错误
- [ ] 应用正常运行
- [ ] 文档完整更新

---

## 📅 预计工期

| 阶段 | 工期 | 说明 |
|------|------|------|
| Phase 1-3 (Common + Vue3 + Vue2) | 2-3 周 | 核心迁移 |
| Phase 4-5 (UniApp + 小程序) | 1-2 周 | 新包创建 |
| 测试与优化 | 1-2 周 | 完整验证 |
| **总计** | **4-7 周** | - |

---

## 📝 下一步行动

1. **评审计划** - 确认拆分方向是否合理
2. **备份现状** - 版本控制(tag)保存当前状态
3. **开始 Phase 1** - 创建 common 包结构
4. **逐步迁移** - 按阶段逐个实施

---

**此计划提供最大的灵活性和长期可维护性！** 🎉
