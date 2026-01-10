# Vite Config

## 概述

`@vben/vite-config` 是项目的 Vite 构建配置包，为 Vue.js 应用和库提供完整的、开箱即用的构建配置。包括应用构建、库构建、插件管理、环境变量处理等功能。

**版本**: 5.5.9  
**类型**: ES Module (ESM)  
**主入口**: `./dist/index.mjs`  
**依赖**: Vite 5.x、Vue 3.x

---

## 核心概念

### 三个主要导出

1. **`defineApplicationConfig`** - Vue SPA 应用配置生成器
2. **`defineLibraryConfig`** - 库/包配置生成器
3. **`loadApplicationPlugins`** / **`loadLibraryPlugins`** - 插件加载器

---

## 1. defineApplicationConfig

用于配置 Vue.js 应用的 Vite 构建。

### 函数签名

```typescript
function defineApplicationConfig(
    userConfigPromise?: DefineApplicationOptions
): UserConfig

// 其中
type DefineApplicationOptions = (config: ConfigEnv) => Promise<{
    application?: {
        // 应用特定选项
    };
    vite?: UserConfig;  // Vite 配置覆盖
}>
```

### 使用示例

#### 基础用法

```typescript
// vite.config.ts
import { defineApplicationConfig } from "@vben/vite-config"

export default defineApplicationConfig()
```

#### 自定义配置

```typescript
import { defineApplicationConfig } from "@vben/vite-config"

export default defineApplicationConfig(async (config) => {
    return {
        application: {
            // 应用配置
            archiver: false,
            compress: false,
            pwa: true,
        },
        vite: {
            // Vite 配置覆盖
            server: {
                port: 3000,
            }
        }
    }
})
```

### 自动处理的功能

#### 1. 插件加载

自动加载以下插件（可通过选项控制）：

| 插件 | 说明 | 选项 |
|------|------|------|
| `@vitejs/plugin-vue` | Vue 3 支持 | 自动 |
| `@vitejs/plugin-vue-jsx` | Vue JSX 支持 | 自动 |
| `unplugin-vue-i18n` | 多语言支持 | `i18n` |
| `vite-plugin-html` | HTML 处理 | `html` |
| `vite-plugin-compression` | 代码压缩 | `compress` |
| `vite-plugin-pwa` | PWA 支持 | `pwa` |
| `vite-plugin-vue-devtools` | Vue 开发工具 | `devtools` |
| 自定义插件 | 额外插件 | 各自选项 |

#### 2. 环境变量加载

```typescript
// 自动加载以下文件
.env
.env.local
.env.{mode}
.env.{mode}.local
```

#### 3. 入口配置

```typescript
{
    build: {
        rollupOptions: {
            output: {
                assetFileNames: "[ext]/[name]-[hash].[ext]",
                chunkFileNames: "js/[name]-[hash].js",
                entryFileNames: "jse/index-[name]-[hash].js",
            },
        },
        target: "es2015",
    }
}
```

#### 4. 样式处理

```typescript
{
    css: {
        preprocessorOptions: {
            scss: {
                importer: new NodePackageImporter(),
            },
        },
    },
    // 可选：注入全局样式
    injectGlobalScss: true
}
```

### 应用特定选项

#### PrintPluginOptions

```typescript
interface PrintPluginOptions {
    infoMap?: Record<string, string | undefined>;
}
```

打印构建信息的配置。

#### NitroMockPluginOptions

```typescript
interface NitroMockPluginOptions {
    mockServerPackage?: string;  // 默认 '@vbenjs/nitro-mock'
    port?: number;               // 默认 3000
    verbose?: boolean;           // 默认 false
}
```

Mock 服务器配置。

#### ArchiverPluginOptions

```typescript
interface ArchiverPluginOptions {
    name?: string;      // 输出文件名，默认 'dist'
    outputDir?: string; // 输出目录，默认 '.'
}
```

压缩归档配置。

---

## 2. defineLibraryConfig

用于配置库/包的 Vite 构建。

### 函数签名

```typescript
function defineLibraryConfig(
    userConfigPromise?: DefineLibraryOptions
): UserConfig

type DefineLibraryOptions = (config: ConfigEnv) => Promise<{
    library?: {
        // 库特定选项
    };
    vite?: UserConfig;
}>
```

### 使用示例

```typescript
// vite.config.ts
import { defineLibraryConfig } from "@vben/vite-config"

export default defineLibraryConfig(async (config) => {
    return {
        library: {
            dts: true,           // 生成 TypeScript 类型
            injectMetadata: true // 注入构建元数据
        },
        vite: {
            // Vite 覆盖配置
        }
    }
})
```

### 自动处理的功能

#### 1. 库输出配置

```typescript
{
    build: {
        lib: {
            entry: "src/index.ts",
            fileName: () => "index.mjs",
            formats: ["es"]    // 仅输出 ESM
        },
        rollupOptions: {
            external: (id) => {
                // 自动外部化 dependencies 和 peerDependencies
                return externalPackages.some(
                    (pkg) => id === pkg || id.startsWith(`${pkg}/`)
                );
            }
        }
    }
}
```

#### 2. 依赖处理

自动将 `dependencies` 和 `peerDependencies` 设置为外部包，避免重复打包。

#### 3. 类型生成

```typescript
{
    dts: {
        // 生成 .d.ts 文件
    }
}
```

### 库特定选项

```typescript
interface LibraryPluginOptions extends CommonPluginOptions {
    dts?: boolean;              // 生成 .d.ts
    injectMetadata?: boolean;   // 注入元数据
}
```

---

## 3. 环境变量处理

### loadEnv(match, confFiles)

从 `.env*` 文件加载匹配前缀的环境变量。

```typescript
async function loadEnv<T = Record<string, string>>(
    match = "VITE_GLOB_",
    confFiles = getConfFiles(),
): Promise<T>
```

**示例**:
```typescript
import { loadEnv } from "@vben/vite-config"

const envConfig = await loadEnv("VITE_GLOB_")
// 获取所有 VITE_GLOB_* 变量
```

### loadAndConvertEnv(match, confFiles)

加载并转换环境变量为配置对象。

```typescript
async function loadAndConvertEnv(
    match = "VITE_",
    confFiles = getConfFiles(),
): Promise<{
    appTitle: string;
    base: string;
    port: number;
    archiver: boolean;
    compress: boolean;
    compressTypes: string[];
    devtools: boolean;
    injectAppLoading: boolean;
    nitroMock: boolean;
    pwa: boolean;
    visualizer: boolean;
}>
```

### 支持的环境变量

| 变量 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| `VITE_APP_TITLE` | 应用标题 | string | "Vben Admin" |
| `VITE_BASE` | 应用基础路径 | string | "/" |
| `VITE_PORT` | 开发服务器端口 | number | 5173 |
| `VITE_ARCHIVER` | 启用压缩归档 | boolean | false |
| `VITE_COMPRESS` | 启用压缩（支持值：gzip,brotli） | string | "" |
| `VITE_DEVTOOLS` | 启用 Vue DevTools | boolean | false |
| `VITE_INJECT_APP_LOADING` | 启用应用加载页 | boolean | false |
| `VITE_NITRO_MOCK` | 启用 Mock 服务器 | boolean | false |
| `VITE_PWA` | 启用 PWA | boolean | false |
| `VITE_VISUALIZER` | 启用依赖分析 | boolean | false |

### 使用示例

```bash
# .env.development
VITE_APP_TITLE=My App Dev
VITE_PORT=3000
VITE_DEVTOOLS=true
VITE_NITRO_MOCK=true

# .env.production
VITE_APP_TITLE=My App
VITE_COMPRESS=gzip,brotli
VITE_PWA=true
VITE_ARCHIVER=true
```

---

## 4. 插件系统

### 插件加载函数

#### loadApplicationPlugins(options)

加载应用构建的所有插件。

```typescript
async function loadApplicationPlugins(
    options: ApplicationPluginOptions
): Promise<PluginOption[]>
```

#### loadLibraryPlugins(options)

加载库构建的插件。

```typescript
async function loadLibraryPlugins(
    options: LibraryPluginOptions
): Promise<PluginOption[]>
```

### 可配置插件列表

#### 应用专用插件

| 插件 | 选项 | 说明 |
|------|------|------|
| HTML | `html` | 注入环境变量到 HTML |
| I18n | `i18n` | 多语言支持 |
| 压缩 | `compress` | gzip/brotli 压缩 |
| PWA | `pwa` | Progressive Web App |
| Archiver | `archiver` | 构建产物压缩归档 |
| Mock | `nitroMock` | Mock API 服务器 |
| 应用加载 | `injectAppLoading` | 注入加载页 |
| 打印 | `print` | 打印构建信息 |

#### 通用插件

| 插件 | 选项 | 说明 |
|------|------|------|
| Vue | 自动 | Vue 3 单文件组件 |
| Vue JSX | 自动 | JSX 语法支持 |
| DevTools | `devtools` | Vue 开发工具 |
| 元数据 | `injectMetadata` | 注入构建元数据 |
| 分析 | `visualizer` | 依赖包大小分析 |

### 插件配置示例

```typescript
export default defineApplicationConfig(async (config) => {
    return {
        application: {
            // 基础插件
            html: true,
            
            // 压缩配置
            compress: true,
            compressTypes: ["gzip", "brotli"],
            
            // 归档配置
            archiver: true,
            archiverPluginOptions: {
                name: "my-app",
                outputDir: "./dist"
            },
            
            // PWA 配置
            pwa: true,
            pwaOptions: {
                manifest: {
                    name: "My App",
                    description: "My Awesome App"
                }
            },
            
            // Mock 配置
            nitroMock: true,
            nitroMockOptions: {
                port: 3001,
                verbose: true
            },
            
            // 开发配置
            devtools: true,
            injectAppLoading: true,
            
            // 分析配置
            visualizer: true
        }
    }
})
```

---

## 5. ImportMap 支持

通过 ImportMap CDN 导入包（实验性）。

### 配置

```typescript
{
    application: {
        importmapOptions: {
            defaultProvider: "esm.sh",  // 或 "jspm.io"
            importmap: [
                { name: "vue" },
                { name: "pinia" },
                { name: "vue-router" },
                { name: "dayjs" }
            ]
        }
    }
}
```

### 支持的 CDN 供应商

- **esm.sh**: 兼容性较好，推荐
- **jspm.io**: 完整功能，但对 ESM 入口要求高

### 注意

目前 ImportMap CDN 功能处于实验阶段，未默认开启，因为：
- 某些包不支持 ESM 导出
- 网络不稳定可能影响加载

---

## 6. CSS/SCSS 处理

### SCSS 导入器

```typescript
{
    css: {
        preprocessorOptions: {
            scss: {
                importer: new NodePackageImporter()
            }
        }
    }
}
```

支持从 `node_modules` 导入 SCSS：

```scss
@import "package-name/styles";
```

### 全局样式注入

```typescript
{
    application: {
        injectGlobalScss: true  // 默认 true
    }
}
```

在所有 Vue 组件中自动注入全局样式变量：

```typescript
// 假设存在 src/styles/variables.scss
// 在所有 .vue 文件中自动可用

<style scoped lang="scss">
.button {
    color: $primary-color;  // 无需 @import
}
</style>
```

---

## 实际使用示例

### 完整的应用配置

```typescript
// vite.config.ts
import { defineApplicationConfig } from "@vben/vite-config"

export default defineApplicationConfig(async (config) => {
    const { command, mode } = config
    const isDev = command === "serve"
    
    return {
        application: {
            // 基础配置
            html: true,
            i18n: true,
            extraAppConfig: true,
            
            // 开发配置
            devtools: isDev,
            injectAppLoading: isDev,
            nitroMock: isDev,
            visualizer: isDev,
            
            // 生产构建
            ...(isDev ? {} : {
                compress: true,
                compressTypes: ["gzip", "brotli"],
                archiver: true,
                pwa: true,
            }),
            
            // PWA 选项
            pwaOptions: {
                manifest: {
                    name: "Vben Admin",
                    short_name: "Vben",
                    description: "Modern admin dashboard"
                }
            },
            
            // 打印构建信息
            printInfoMap: {
                "GitHub": "https://github.com/vbenjs/vue-vben-admin",
                "Docs": "https://doc.vben.pro"
            }
        },
        
        // 覆盖 Vite 配置
        vite: {
            server: {
                port: 5173,
                host: "0.0.0.0",
                hmr: {
                    protocol: "ws",
                    host: "localhost"
                }
            },
            preview: {
                port: 4173
            }
        }
    }
})
```

### 完整的库配置

```typescript
// packages/my-lib/vite.config.ts
import { defineLibraryConfig } from "@vben/vite-config"

export default defineLibraryConfig(async (config) => {
    return {
        library: {
            dts: true,
            injectMetadata: true
        },
        vite: {
            build: {
                rollupOptions: {
                    input: "src/index.ts"
                }
            }
        }
    }
})
```

---

## 常用配置覆盖

### 修改开发服务器

```typescript
vite: {
    server: {
        port: 3000,
        host: "0.0.0.0",
        open: true,
        proxy: {
            "/api": {
                target: "http://localhost:3001",
                changeOrigin: true
            }
        }
    }
}
```

### 优化构建输出

```typescript
vite: {
    build: {
        rollupOptions: {
            output: {
                manualChunks: {
                    vue: ["vue", "vue-router", "pinia"],
                    utils: ["lodash-es"]
                }
            }
        },
        minify: "esbuild"
    }
}
```

### 配置路径别名

```typescript
application: {
    // 通过 TypeScript/Vite 配置
}

// 在 vite 中覆盖
vite: {
    resolve: {
        alias: {
            "@": "/src",
            "@components": "/src/components"
        }
    }
}
```

---

## 最佳实践

1. **使用环境变量**: 通过 `.env*` 文件管理配置，而非硬编码
2. **按需启用插件**: 根据实际需求启用插件，减少构建体积
3. **开发与生产分离**: 使用 `isBuild` 条件加载不同插件
4. **类型安全**: 始终使用 TypeScript，利用类型检查
5. **性能优化**: 
   - 启用压缩（生产环境）
   - 使用 visualizer 分析依赖
   - 合理配置 chunk 分割

---

## 故障排除

### Q: 应用启动缓慢

**A**: 
- 检查是否启用了不必要的插件
- 在开发环境禁用 `archiver` 和 `compress`
- 使用 `visualizer` 分析依赖瓶颈

### Q: 环境变量未生效

**A**:
- 确保 `.env` 文件命名正确
- 检查变量是否以 `VITE_` 开头
- 重启开发服务器

### Q: PWA 未工作

**A**:
- PWA 仅在 HTTPS 或 localhost 下工作
- 检查 manifest 配置是否完整
- 检查浏览器控制台的 Service Worker 错误

---

## 参考资源

- [Vite Documentation](https://vitejs.dev/)
- [Vite Plugins](https://vitejs.dev/plugins/)
- [Vue 3 Official Guide](https://vuejs.org/)
- [Web.dev PWA Guide](https://web.dev/progressive-web-apps/)
