"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useChildren)("radio"),
    props: {
        value: {
            type: null,
            observer: "updateChildren",
        },
        direction: String,
        disabled: {
            type: Boolean,
            observer: "updateChildren",
        },
    },
    methods: {
        updateChildren () {
            this.children.forEach((child) => { return child.updateFromParent(); });
        },
    },
});
