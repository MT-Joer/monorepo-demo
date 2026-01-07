export * from "./command";
export * from "./comments";
export * from "./disableds";
export * from "./ignores";
export * from "./import";
export * from "./javascript";
export * from "./jsdoc";
export * from "./jsonc";
export * from "./node";
export * from "./perfectionist";
// export * from "./prettier";
export * from "./regexp";
export * from "./test";
export * from "./turbo";
export * from "./typescript";
export * from "./unicorn";
export * from "./vue";
export * from "./wxml";
/*
	eslint-config/src/configs/index.ts

	说明：将各子配置模块集中导出，便于 `defineConfig` 按需加载。
	注：每个子模块负责单一职责（例如 import 规则、typescript 规则、vue 规则等），易于维护与测试。
*/
