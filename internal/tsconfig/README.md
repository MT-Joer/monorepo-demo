# TypeScript Config

## 概述

`@vben/tsconfig` 是项目的 TypeScript 配置包，为不同类型的项目（Web 应用、库、Node.js 工具等）提供统一的编译配置预设。通过组合继承，确保整个 Monorepo 的 TypeScript 配置一致性。

**版本**: 5.5.9  
**类型**: JSON 配置  
**包文件**:
- `base.json` - 基础配置
- `library.json` - 库配置
- `node.json` - Node.js 配置
- `web.json` - Web 包配置
- `web-app.json` - Web 应用配置

---

## 配置文件关系

```
base.json (基础配置)
├── library.json (库配置)
├── node.json (Node.js 配置)
├── web.json (Web 包配置)
│   └── web-app.json (Web 应用配置)
```

---

## 1. base.json - 基础配置

**用途**: 所有其他配置的基础，定义通用的编译选项和严格检查规则。

### 核心选项

#### 目标和模块

```jsonc
{
  "compilerOptions": {
    "target": "ESNext",           // 编译目标：最新 JavaScript
    "module": "ESNext",           // 模块格式：ESNext
    "moduleDetection": "force",   // 强制模块检测
    "moduleResolution": "node"    // 模块解析：Node.js 算法
  }
}
```

#### 严格模式

完整启用 TypeScript 严格模式：

```jsonc
{
  "compilerOptions": {
    "strict": true,              // 启用所有严格检查
    "strictNullChecks": true,    // null 类型检查
    "noImplicitAny": true,       // 禁止隐式 any
    "noImplicitThis": true,      // 禁止隐式 this
    "noImplicitOverride": true,  // 禁止隐式覆盖基类方法
    "noFallthroughCasesInSwitch": true, // switch 穿透检查
    "noUncheckedIndexedAccess": true,   // 数组索引检查
    "noUnusedLocals": true,      // 未使用变量检查
    "noUnusedParameters": true   // 未使用参数检查
  }
}
```

#### 输出配置

```jsonc
{
  "compilerOptions": {
    "noEmit": true,              // 不输出编译文件（仅类型检查）
    "removeComments": true,      // 移除注释
    "sourceMap": false,          // 禁用源映射
    "inlineSources": false       // 禁用内联源代码
  }
}
```

#### 其他选项

```jsonc
{
  "compilerOptions": {
    "experimentalDecorators": true,     // 支持装饰器
    "resolveJsonModule": true,          // 允许导入 JSON
    "esModuleInterop": true,            // CommonJS 互操作
    "allowSyntheticDefaultImports": true, // 合成默认导入
    "forceConsistentCasingInFileNames": true, // 强制文件名大小写
    "isolatedModules": true,            // 隔离模块编译
    "verbatimModuleSyntax": true,       // 按字面意思保留模块语法
    "skipLibCheck": true,               // 跳过库类型检查
    "preserveWatchOutput": true         // 保留 watch 输出
  }
}
```

### 排除配置

```jsonc
{
  "exclude": [
    "**/node_modules/**",  // 排除依赖
    "**/dist/**",          // 排除构建输出
    "**/.turbo/**"         // 排除 Turbo 缓存
  ]
}
```

### 使用场景

基础配置定义了所有项目都应遵守的规则，其他配置通过继承和覆盖来适应特定场景。

---

## 2. library.json - 库配置

**用途**: 用于 NPM 库包、构建工具包等可发布的库。

### 继承关系

```jsonc
{
  "extends": "./base.json"
}
```

### 额外选项

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve",           // 保留 JSX 语法（不转换）
    "lib": ["ESNext", "DOM", "DOM.Iterable"], // 库定义
    "useDefineForClassFields": true,          // 使用定义类字段
    "moduleResolution": "bundler",            // 打包器模块解析
    "declaration": true,         // 生成 .d.ts 类型文件
    "noEmit": false              // 输出编译文件（覆盖 base）
  }
}
```

### 特性说明

| 选项 | 说明 |
|------|------|
| `jsx: "preserve"` | 保留 JSX，让构建工具处理 |
| `declaration: true` | 生成 TypeScript 类型定义文件 |
| `moduleResolution: "bundler"` | 用于打包器环境（支持 ESM） |
| `noEmit: false` | 输出编译后的 JavaScript 和 .d.ts |

### 适用包

- `@vben/node-utils`
- `@vben/eslint-config`
- `@vben/prettier-config`
- `@vben/vite-config`
- `@vben/tailwind-config`

### 使用示例

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}
```

---

## 3. node.json - Node.js 配置

**用途**: 用于 Node.js 脚本、CLI 工具、后端服务等。

### 继承关系

```jsonc
{
  "extends": "./base.json"
}
```

### 特有选项

```jsonc
{
  "compilerOptions": {
    "composite": false,      // 不支持引用项目
    "lib": ["ESNext"],       // 仅 ESNext，无 DOM
    "types": ["node"],       // Node.js 类型定义
    "baseUrl": "./",         // 基础 URL
    "noImplicitAny": true    // 强制 any 类型检查
  }
}
```

### 特性说明

| 选项 | 说明 |
|------|------|
| `lib: ["ESNext"]` | 仅包含 JavaScript 标准库，不包含 DOM |
| `types: ["node"]` | 加载 `@types/node` |
| `composite: false` | 不使用 TypeScript 项目引用 |

### 适用包

- `@vben/node-utils`（作为 Node.js 工具库）
- 构建脚本
- CLI 工具

### 使用示例

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["src/**/*.test.ts"]
}
```

---

## 4. web.json - Web 包配置

**用途**: 用于 Web 组件库、工具库等 Web 相关但非独立应用的包。

### 继承关系

```jsonc
{
  "extends": "./base.json"
}
```

### 特有选项

```jsonc
{
  "compilerOptions": {
    "jsx": "preserve",           // 保留 JSX
    "jsxImportSource": "vue",    // JSX 导入源：Vue
    "lib": ["ESNext", "DOM", "DOM.Iterable"],
    "useDefineForClassFields": true,
    "moduleResolution": "bundler",
    "types": ["vite/client"],    // Vite 客户端类型
    "declaration": false         // 不生成 .d.ts
  }
}
```

### 特性说明

| 选项 | 说明 |
|------|------|
| `jsxImportSource: "vue"` | JSX 语法使用 Vue |
| `types: ["vite/client"]` | 加载 Vite 客户端类型 |
| `declaration: false` | 不生成类型文件（由构建工具处理） |

### 适用包

- `@vben/ui-kit`（UI 组件库）
- `@vben/effects`（Vue 组合函数）
- Web 组件库

### 使用示例

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.{ts,tsx,vue}"],
  "exclude": ["src/**/*.test.ts"]
}
```

---

## 5. web-app.json - Web 应用配置

**用途**: 用于 Vue.js SPA（单页应用）和 Web 应用。

### 继承关系

```jsonc
{
  "extends": "./web.json"  // 继承自 web.json
}
```

### 额外选项

```jsonc
{
  "compilerOptions": {
    "types": [
      "vite/client",           // Vite 客户端
      "@vben/types/global"     // 自定义全局类型
    ]
  }
}
```

### 特性说明

包含 `web.json` 的所有配置，另外加载：
- `vite/client`: Vite 环境变量和特性类型
- `@vben/types/global`: 项目自定义全局类型

### 适用包

- `apps/web/` - 主应用
- `apps/playground/` - 演示项目

### 使用示例

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": [
    "src/**/*.{ts,tsx,vue}",
    "env.d.ts"
  ],
  "exclude": ["src/**/*.test.ts"]
}
```

---

## 选择指南

### 选择哪个配置？

| 项目类型 | 配置 | 说明 |
|---------|------|------|
| Vue SPA 应用 | `web-app.json` | 包含 Vite、Vue、全局类型 |
| Web 组件库 | `web.json` | Vue JSX + DOM 支持 |
| Node.js 工具 | `node.json` | 纯 Node.js，无 DOM |
| 通用库 | `library.json` | 生成 .d.ts，ESM 优先 |
| 基础配置 | `base.json` | 极少数特殊场景 |

### 决策树

```
项目是什么？
├── Vue.js 应用 → web-app.json
├── Web 组件库 → web.json
├── Node.js 工具 → node.json
├── 通用库/包 → library.json
└── 其他 → base.json
```

---

## 实际使用

### 应用到项目

在项目根目录的 `tsconfig.json` 中：

```json
{
  "extends": "@vben/tsconfig/web-app.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    },
    "outDir": "./dist"
  },
  "include": [
    "src/**/*.{ts,tsx,vue}",
    "env.d.ts"
  ]
}
```

### 子包配置

在 Monorepo 子包中：

```json
{
  "extends": "@vben/tsconfig/library.json",
  "compilerOptions": {
    "baseUrl": ".",
    "outDir": "./dist",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"]
}
```

---

## 编译选项详解

### 严格选项的影响

| 选项 | 启用前 | 启用后 |
|------|--------|--------|
| `noImplicitAny` | `let x;` ✅ | `let x;` ❌ |
| `strictNullChecks` | `null` 可赋给任何类型 | `null` 仅可赋给 nullable 类型 |
| `noUnusedLocals` | 允许未使用的变量 | 禁止未使用的变量 |
| `noImplicitThis` | `this: any` | `this` 必须有明确类型 |

### JSX 选项

| 选项 | 行为 |
|------|------|
| `jsx: "preserve"` | 保留 JSX，输出 `.jsx` 文件 |
| `jsx: "react"` | 转换为 `React.createElement()` |
| `jsx: "react-jsx"` | 使用 React 17+ 新 JSX 转换 |

### 模块解析

| 解析器 | 场景 |
|--------|------|
| `node` | Node.js 风格，支持 ESM 和 CommonJS |
| `bundler` | 打包器环境，支持条件导出 |
| `classic` | TypeScript 默认（已过时） |

---

## 常见问题

### Q: 为什么使用 `noEmit: true`？

A: 基础配置只进行类型检查，不输出 JavaScript。实际构建由 Vite、esbuild 等工具负责。库配置覆盖为 `noEmit: false`，输出编译文件和 .d.ts。

### Q: `verbatimModuleSyntax` 的作用？

A: 保留 import/export 语法的字面意思，避免 TypeScript 的自动转换，让构建工具决定如何处理模块。

### Q: 如何为项目添加全局类型？

A: 创建 `env.d.ts` 或 `global.d.ts`，并在 `tsconfig.json` 的 `include` 中包含它：

```json
{
  "include": ["src/**/*.ts", "env.d.ts"]
}
```

### Q: 项目报错"类型不匹配"，如何快速修复？

A: 不建议禁用严格模式。建议：
1. 修复代码以符合类型要求
2. 使用 `as` 进行类型断言（谨慎）
3. 在局部禁用检查（`// @ts-ignore`）

---

## 最佳实践

1. **继承不覆盖**: 优先继承适合的预设，仅覆盖必要选项
2. **保持严格**: 不要禁用严格选项，它们帮助发现代码问题
3. **路径别名**: 使用 `paths` 配置简化导入：
   ```json
   {
     "compilerOptions": {
       "paths": {
         "@/*": ["src/*"],
         "@components/*": ["src/components/*"]
       }
     }
   }
   ```
4. **类型增强**: 使用 `types` 选项加载特定库的类型定义

---

## 参考资源

- [TypeScript Compiler Options](https://www.typescriptlang.org/tsconfig)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite TypeScript](https://vitejs.dev/guide/features.html#typescript)
