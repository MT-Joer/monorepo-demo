/*
  eslint-config/src/configs/regexp.ts

  说明：正则表达式安全规则（eslint-plugin-regexp）以防止常见的正则错误。
  要点：
  - 使用插件推荐配置即可
  - 避免性能问题、空字符、多字符重复等常见正则缺陷
*/

import type { Linter } from 'eslint';

import { interopDefault } from '../util';

export async function regexp(): Promise<Linter.Config[]> {
	const [pluginRegexp] = await Promise.all([
		interopDefault(import('eslint-plugin-regexp')),
	] as const);

	return [
		{
			plugins: {
				regexp: pluginRegexp,
			},
			rules: {
				...pluginRegexp.configs.recommended.rules,
			},
		},
	];
}
