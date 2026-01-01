/*
  eslint-config/src/configs/command.ts

  说明：ESLint 命令注释支持（eslint-plugin-command），允许通过注释下达 lint 命令。
  要点：
  - 该插件较简洁，直接返回创建的配置对象
*/

import createCommand from 'eslint-plugin-command/config';

export async function command() {
	return [
		{
			...createCommand(),
		},
	];
}
