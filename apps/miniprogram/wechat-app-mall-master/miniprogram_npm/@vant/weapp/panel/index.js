"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

(0, component_1.VantComponent)({
    classes: [ "header-class", "footer-class" ],
    props: {
        desc: String,
        title: String,
        status: String,
    },
});
