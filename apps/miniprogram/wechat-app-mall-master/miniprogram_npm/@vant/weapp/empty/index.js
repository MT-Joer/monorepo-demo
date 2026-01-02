"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

(0, component_1.VantComponent)({
    props: {
        description: String,
        image: {
            type: String,
            value: "default",
        },
    },
});
