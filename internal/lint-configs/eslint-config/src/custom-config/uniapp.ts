import type { Linter } from "eslint";


export function customConfigUniapp(): Linter.Config[] {
    return [
        {
            files: [ "apps/**/uniapp/**/**" ],
            rules:{
                "eslint-comments/no-unlimited-disable":"off",
                "unicorn/prefer-module": "warn",
            }
        }
    ];
}
