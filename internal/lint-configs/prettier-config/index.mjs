export default {
    printWidth: 120,
    tabWidth: 4,
    useTabs: true,
    semi: true,
    singleQuote: false,

    htmlWhitespaceSensitivity: "ignore",
    bracketSameLine: true,
	  plugins: [
        "prettier-plugin-tailwindcss",
        "@venus/prettier-plugin-wxml",
    ],
    overrides: [
        {
            files: [ "*.json5" ],
            options: {
                quoteProps: "preserve",
                singleQuote: false,
            },
        },
        {
            files: [ "*.wxml" ],
            options: {
                parser: "wxml",
            },
        },
    ],

};
