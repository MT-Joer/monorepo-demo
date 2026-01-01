/*
  eslint-config/src/configs/ignores.ts

  说明：配置全仓库的忽略文件模式（node_modules, dist, build outputs 等）。
  要点：
  - 忽略构建产物和依赖目录以加速 lint 速度
  - 忽略自动生成的文件（auto-imports.d.ts, components.d.ts 等）
  - 忽略配置缓存和临时目录
*/

import type { Linter } from 'eslint';

export async function ignores(): Promise<Linter.Config[]> {
	return [
		{
			ignores: [
				'**/node_modules',
				'**/dist',
				'**/dist-*',
				'**/*-dist',
				'**/.husky',
				'**/.nitro',
				'**/.output',
				'**/Dockerfile',
				'**/package-lock.json',
				'**/yarn.lock',
				'**/pnpm-lock.yaml',
				'**/bun.lockb',
				'**/output',
				'**/coverage',
				'**/temp',
				'**/.temp',
				'**/tmp',
				'**/.tmp',
				'**/.history',
				'**/.turbo',
				'**/.nuxt',
				'**/.next',
				'**/.vercel',
				'**/.changeset',
				'**/.idea',
				'**/.cache',
				'**/.output',
				'**/.vite-inspect',

				'**/CHANGELOG*.md',
				'**/*.min.*',
				'**/LICENSE*',
				'**/__snapshots__',
				'**/*.snap',
				'**/fixtures/**',
				'**/.vitepress/cache/**',
				'**/auto-import?(s).d.ts',
				'**/components.d.ts',
				'**/vite.config.mts.*',
				'**/*.sh',
				'**/*.ttf',
				'**/*.woff',
			],
		},
	];
}
