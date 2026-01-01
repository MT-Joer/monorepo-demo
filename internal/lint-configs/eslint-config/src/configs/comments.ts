/*
  eslint-config/src/configs/comments.ts

  说明：ESLint 注释指令规则（eslint-plugin-eslint-comments）用于规范禁用注释。
  要点：
  - 禁止聚合多个规则到一个 enable 注释（需要分别 enable）
  - 禁止重复禁用或未使用的 enable 注释
  - 防止过度使用 eslint-disable-next-line
*/

import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function comments(): Promise<Linter.Config[]> {
	const [pluginComments] = await Promise.all([
		// @ts-expect-error - no types
		interopDefault(import('eslint-plugin-eslint-comments')),
	] as const);

	return [
		{
			plugins: {
				'eslint-comments': pluginComments,
			},
			rules: {
				'eslint-comments/no-aggregating-enable': 'error',
				'eslint-comments/no-duplicate-disable': 'error',
				'eslint-comments/no-unlimited-disable': 'error',
				'eslint-comments/no-unused-enable': 'error',
			},
		},
	];
}
