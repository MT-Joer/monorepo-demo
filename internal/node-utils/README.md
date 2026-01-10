# Node Utils

## 概述

`@vben/node-utils` 是一个 Node.js 工具库，为 Vben 项目提供常用的工具函数和 Monorepo 辅助功能。包含 9 个核心模块，涵盖文件操作、Git 管理、日期处理、哈希计算等功能。

**版本**: 5.5.9  
**类型**: ES Module (ESM)  
**主入口**: `./dist/index.mjs`  

---

## 核心模块

### 1. constants

通用常量定义。

#### 导出内容

```typescript
enum UNICODE {
  FAILURE = "\u2716", // ✖
  SUCCESS = "\u2714", // ✔
}
```

#### 使用示例

```typescript
import { UNICODE } from "@vben/node-utils";

console.log(UNICODE.SUCCESS); // ✔
console.log(UNICODE.FAILURE); // ✖
```

---

### 2. date

基于 `dayjs` 的日期时间工具，预配置了时区和 UTC 支持。

#### 特性

- ✅ **时区支持**: 默认时区为亚洲/上海
- ✅ **UTC 插件**: 支持 UTC 转换
- ✅ **轻量级**: 基于 dayjs，比 moment 更小

#### 导出内容

```typescript
const dateUtil = dayjs // dayjs 实例，已扩展时区和 UTC 插件
```

#### 使用示例

```typescript
import { dateUtil } from "@vben/node-utils";

// 当前时间（上海时区）
const now = dateUtil();
console.log(now.format('YYYY-MM-DD HH:mm:ss'));

// 特定时区转换
const utcTime = dateUtil.utc('2024-01-10 12:00:00');
const shanghaiTime = utcTime.tz('Asia/Shanghai');

// 日期加减
const tomorrow = dateUtil().add(1, 'day');
const lastMonth = dateUtil().subtract(1, 'month');

// 时间戳
const timestamp = dateUtil().unix();
const milliseconds = dateUtil().valueOf();
```

#### 常用方法

| 方法 | 说明 | 示例 |
|------|------|------|
| `.format(format)` | 格式化日期 | `dateUtil().format('YYYY-MM-DD')` |
| `.add(value, unit)` | 加时间 | `dateUtil().add(1, 'day')` |
| `.subtract(value, unit)` | 减时间 | `dateUtil().subtract(1, 'month')` |
| `.unix()` | 获取 Unix 时间戳 | `dateUtil().unix()` |
| `.tz(timezone)` | 转换时区 | `dateUtil().tz('UTC')` |

---

### 3. fs

文件系统操作工具。

#### 导出函数

##### `outputJSON(filePath, data, spaces?)`

写入 JSON 文件，自动创建目录。

```typescript
async function outputJSON(
    filePath: string,
    data: any,
    spaces: number = 2
): Promise<void>
```

**参数**:
- `filePath`: 目标文件路径
- `data`: 要写入的数据对象
- `spaces`: JSON 缩进空格数（默认 2）

**示例**:
```typescript
import { outputJSON } from "@vben/node-utils";

await outputJSON('config/app.json', {
    name: 'myapp',
    version: '1.0.0'
});
```

##### `readJSON(filePath)`

读取 JSON 文件。

```typescript
async function readJSON(filePath: string): Promise<any>
```

**示例**:
```typescript
import { readJSON } from "@vben/node-utils";

const config = await readJSON('config/app.json');
console.log(config.name);
```

##### `ensureFile(filePath)`

确保文件存在，不存在则创建。

```typescript
async function ensureFile(filePath: string): Promise<void>
```

**示例**:
```typescript
import { ensureFile } from "@vben/node-utils";

await ensureFile('logs/app.log');
```

---

### 4. git

Git 操作工具。

#### 特性

- ✅ **暂存区检测**: 获取 Git 暂存区的文件列表
- ✅ **@changesets/git 集成**: 导出所有 changesets/git 功能
- ✅ **路径规范化**: 自动转换为绝对路径

#### 导出函数

##### `getStagedFiles()`

获取当前 Git 暂存区中的所有文件。

```typescript
async function getStagedFiles(): Promise<string[]>
```

**返回**: 暂存文件的绝对路径数组

**示例**:
```typescript
import { getStagedFiles } from "@vben/node-utils";

const stagedFiles = await getStagedFiles();
console.log(stagedFiles);
// ['/path/to/file1.ts', '/path/to/file2.vue', ...]
```

**实现细节**:
- 使用 `git diff --staged` 获取变更文件
- 支持文件类型: ACMR（新增、复制、修改、重命名）
- 忽略子模块

##### `gitAdd()` (从 @changesets/git)

暂存文件到 Git。

```typescript
export { add as gitAdd } from "@changesets/git";
```

##### 其他 changesets/git 函数

所有 `@changesets/git` 导出都可用，包括：
- `getCommitHash()`
- `getFilesSince()`
- `getFilesChanged()`
- 等等

---

### 5. hash

内容哈希生成工具。

#### 导出函数

##### `generatorContentHash(content, hashLSize?)`

基于内容生成 MD5 哈希。

```typescript
function generatorContentHash(
    content: string,
    hashLSize?: number
): string
```

**参数**:
- `content`: 要哈希的内容
- `hashLSize`: 哈希长度（可选，默认返回完整 32 位）

**返回**: MD5 哈希字符串

**示例**:
```typescript
import { generatorContentHash } from "@vben/node-utils";

// 完整哈希
const fullHash = generatorContentHash('hello world');
// 'fcf730022f6b6467d40e75a4d667ea7c'

// 截断哈希
const shortHash = generatorContentHash('hello world', 8);
// 'fcf73002'
```

**用途**:
- 文件版本控制
- 构建产物命名
- 缓存键生成

---

### 6. monorepo

Monorepo 工具集，用于操作多包项目。

#### 导出函数

##### `findMonorepoRoot(cwd?)`

查找 Monorepo 根目录。

```typescript
function findMonorepoRoot(cwd?: string): string
```

**参数**:
- `cwd`: 搜索起点（默认当前工作目录）

**返回**: Monorepo 根目录路径

**实现**: 通过查找 `pnpm-lock.yaml` 确定

**示例**:
```typescript
import { findMonorepoRoot } from "@vben/node-utils";

const root = findMonorepoRoot();
console.log(root); // '/path/to/monorepo'
```

##### `getPackagesSync()`

同步获取所有 Monorepo 包。

```typescript
function getPackagesSync(): {
    packages: Package[];
    rootPackageJson: PackageJson;
}
```

**返回**: 包列表和根 package.json

**示例**:
```typescript
import { getPackagesSync } from "@vben/node-utils";

const { packages } = getPackagesSync();
packages.forEach(pkg => {
    console.log(pkg.packageJson.name);
    console.log(pkg.dir);
});
```

##### `getPackages()`

异步版本的 `getPackagesSync()`。

```typescript
async function getPackages(): Promise<{
    packages: Package[];
    rootPackageJson: PackageJson;
}>
```

##### `getPackage(pkgName)`

获取指定包的信息。

```typescript
async function getPackage(pkgName: string): Promise<Package | undefined>
```

**参数**:
- `pkgName`: 包名（如 `@vben/core`）

**示例**:
```typescript
import { getPackage } from "@vben/node-utils";

const pkg = await getPackage('@vben/core');
if (pkg) {
    console.log(pkg.dir);
    console.log(pkg.packageJson.version);
}
```

#### Package 接口

```typescript
interface Package {
    dir: string;              // 包目录路径
    packageJson: PackageJson; // package.json 内容
    relativeDir: string;      // 相对于根目录的路径
}
```

#### 使用场景

- **动态 scope 生成**: commitlint 配置中使用
- **包依赖分析**: 检测循环依赖
- **批量操作**: 对所有包执行脚本

---

### 7. path

路径工具集。

#### 导出函数

##### `toPosixPath(pathname)`

将路径转换为 POSIX 格式（Unix 风格）。

```typescript
function toPosixPath(pathname: string): string
```

**功能**: 将 Windows 反斜杠 `\` 转换为正斜杠 `/`

**参数**:
- `pathname`: 原始路径

**返回**: POSIX 格式路径

**示例**:
```typescript
import { toPosixPath } from "@vben/node-utils";

// Windows 路径
const winPath = 'C:\\Users\\Desktop\\file.ts';
const posixPath = toPosixPath(winPath);
console.log(posixPath); // 'C:/Users/Desktop/file.ts'

// 已是 POSIX 路径
const alreadyPosix = toPosixPath('/home/user/file.ts');
console.log(alreadyPosix); // '/home/user/file.ts'
```

**用途**:
- 跨平台路径兼容
- ESM 模块导入路径
- Git 路径处理

---

### 8. prettier

代码格式化工具，基于 Prettier 配置。

#### 导出函数

##### `prettierFormat(filepath)`

使用 Prettier 格式化文件，自动应用配置。

```typescript
async function prettierFormat(filepath: string): Promise<string>
```

**功能**:
- 自动检测文件类型
- 加载项目 Prettier 配置
- 格式化文件并覆写原文件

**参数**:
- `filepath`: 要格式化的文件路径

**返回**: 格式化后的内容

**示例**:
```typescript
import { prettierFormat } from "@vben/node-utils";

// 格式化单个文件
await prettierFormat('src/main.ts');

// 格式化目录中的所有 TS 文件
import glob from 'glob';
const files = glob.sync('src/**/*.{ts,tsx,vue}');
for (const file of files) {
    await prettierFormat(file);
}
```

**特性**:
- 智能解析器选择
- 只在内容改变时写入文件
- 自动创建备份（可选）

---

### 9. spinner

加载动画工具。

#### 导出函数

##### `spinner(options, callback)`

显示加载动画并执行异步任务。

```typescript
async function spinner<T>(
    {
        title: string,
        successText?: string,
        failedText?: string
    },
    callback: () => Promise<T>
): Promise<T>
```

**参数**:
- `title`: 加载动画显示的标题
- `successText`: 成功时的消息（默认 "Success!"）
- `failedText`: 失败时的消息（默认 "Failed!"）
- `callback`: 要执行的异步函数

**返回**: 回调函数的返回值

**示例**:
```typescript
import { spinner } from "@vben/node-utils";

// 基础用法
await spinner(
    { title: 'Building project...' },
    async () => {
        // 执行耗时操作
        await buildProject();
    }
);

// 自定义消息
await spinner(
    {
        title: 'Deploying app...',
        successText: 'Deployed successfully! 🚀',
        failedText: 'Deployment failed!'
    },
    async () => {
        await deploy();
    }
);

// 异常处理
try {
    const result = await spinner(
        { title: 'Processing...' },
        async () => {
            // 可能抛出异常
            return await processData();
        }
    );
    console.log(result);
} catch (error) {
    console.error('Process failed:', error);
}
```

**工作流**:
1. 显示加载动画（转动的圆圈）
2. 执行回调函数
3. 成功时显示 ✔ 和成功消息
4. 失败时显示 ✖ 和失败消息
5. 返回异步函数的结果或抛出异常

---

## 附加导出

除了上述模块外，还导出了以下常用库：

### 文件系统

```typescript
export { default as fs } from "node:fs/promises";
```

使用原生 Node.js 的异步文件系统 API。

### 工具库

```typescript
export { default as colors } from "chalk";          // 终端彩色输出
export { consola } from "consola";                  // 日志库
export * from "execa";                              // 进程执行
export { rimraf } from "rimraf";                    // 删除文件/目录
export { readPackageJSON } from "pkg-types";        // 读取 package.json
```

### Changesets

```typescript
export * from "@changesets/git";                   // Git 操作
export { type Package } from "@manypkg/get-packages"; // 包类型定义
```

---

## 综合使用示例

### 场景 1: 批量格式化暂存文件

```typescript
import {
    getStagedFiles,
    prettierFormat,
    spinner
} from "@vben/node-utils";

await spinner(
    { title: 'Formatting staged files...' },
    async () => {
        const files = await getStagedFiles();
        
        for (const file of files) {
            if (file.endsWith('.ts') || file.endsWith('.vue')) {
                await prettierFormat(file);
            }
        }
    }
);
```

### 场景 2: 查询 Monorepo 包信息

```typescript
import {
    getPackagesSync,
    findMonorepoRoot,
    toPosixPath
} from "@vben/node-utils";

const root = findMonorepoRoot();
const { packages } = getPackagesSync();

packages.forEach(pkg => {
    const relPath = toPosixPath(pkg.relativeDir);
    console.log(`${pkg.packageJson.name} @ ${relPath}`);
});
```

### 场景 3: 生成内容哈希

```typescript
import {
    generatorContentHash,
    readJSON,
    outputJSON
} from "@vben/node-utils";

const config = await readJSON('config.json');
const hash = generatorContentHash(JSON.stringify(config), 8);

await outputJSON('config.hash.json', {
    hash,
    timestamp: new Date().toISOString()
});
```

### 场景 4: 执行 Git 操作并记录

```typescript
import {
    getStagedFiles,
    dateUtil,
    consola
} from "@vben/node-utils";

const files = await getStagedFiles();
const now = dateUtil().format('YYYY-MM-DD HH:mm:ss');

consola.info(`${now} - Staged files: ${files.length}`);
files.forEach(f => consola.info(`  - ${f}`));
```

---

## 最佳实践

1. **Async/Await**: 所有文件/Git 操作都是异步的，使用 `async/await`
2. **错误处理**: 用 try-catch 或 `.catch()` 处理异步异常
3. **路径统一**: 使用 `toPosixPath()` 确保跨平台兼容性
4. **性能**: 使用 `getPackagesSync()` 替代异步版本可提升性能（如无必要）

---

## 参考资源

- [Dayjs Documentation](https://day.js.org/)
- [Chalk Documentation](https://github.com/chalk/chalk)
- [Consola Documentation](https://github.com/unjs/consola)
- [Execa Documentation](https://github.com/sindresorhus/execa)
