// stylelint.config.ts
import type { Config } from "stylelint";

// 从 Config 类型中提取 overrides 字段的类型（即 ConfigOverride[]）
type ConfigOverride = NonNullable<Config["overrides"]>[number];

export function configMiniprogram():ConfigOverride[] {
    return [
        // WXSS 文件的配置（纯样式文件）
        {
            files: [ "**/apps/miniprogram/**/*.wxss", "**/apps/uniapp/**/*.css" ],
            customSyntax: "postcss",
            extends: [ "stylelint-config-recess-order" ],
            rules: {
                // 允许 rpx 单位（uni-app 响应式单位）
                "unit-no-unknown": [
                    true,
                    {
                        ignoreUnits: [ "rpx" ]
                    }
                ],
                // 允许未知的属性值（uni-app 特有值）
                "declaration-property-value-no-unknown": null,
                // 允许 uni-app 的条件编译注释
                "comment-no-empty": null,
                // 小程序特有的选择器
                "selector-type-no-unknown": [
                    true,
                    {
                        ignore: [ "custom-elements" ],
                        ignoreTypes: [ "/^(page|view|text|image|button|input|scroll-view|swiper|navigator)/" ]
                    }
                ],
            },
        },
        // Vue 和 HTML 中的样式块
        {
            files: [ "**/apps/miniprogram/**/*.{vue,html}", "**/apps/uniapp/**/*.{vue,html}" ],
            customSyntax: "postcss-html",
            extends: [ "stylelint-config-recess-order" ],
            rules: {
                // 允许 rpx 单位
                "unit-no-unknown": [
                    true,
                    {
                        ignoreUnits: [ "rpx" ]
                    }
                ],
                // 允许未知的属性值
                "declaration-property-value-no-unknown": null,
                // 允许 uni-app 的条件编译注释
                "comment-no-empty": null,
                // 小程序特有的选择器
                "selector-type-no-unknown": [
                    true,
                    {
                        ignore: [ "custom-elements" ],
                        ignoreTypes: [ "/^(page|view|text|image|button|input|scroll-view|swiper|navigator)/" ]
                    }
                ],
                // Vue 的伪类选择器（如 :global, :deep）
                "selector-pseudo-class-no-unknown": [
                    true,
                    {
                        ignorePseudoClasses: [ "global", "deep" ],
                    },
                ],
                // Vue 的伪元素选择器（如 v-deep, v-global）
                "selector-pseudo-element-no-unknown": [
                    true,
                    {
                        ignorePseudoElements: [
                            "v-deep",
                            "v-global",
                            "v-slotted",
                        ],
                    },
                ],
            },
        },
    ];
}
