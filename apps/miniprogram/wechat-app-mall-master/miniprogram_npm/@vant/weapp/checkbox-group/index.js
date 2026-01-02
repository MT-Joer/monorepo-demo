"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useChildren)("checkbox", function (target) {
        this.updateChild(target);
    }),
    props: {
        max: Number,
        value: {
            type: Array,
            observer: "updateChildren",
        },
        disabled: {
            type: Boolean,
            observer: "updateChildren",
        },
        direction: {
            type: String,
            value: "vertical",
        },
    },
    methods: {
        updateChildren () {
            const _this = this;
            this.children.forEach((child) => { return _this.updateChild(child); });
        },
        updateChild (child) {
            const _a = this.data; const value = _a.value; const disabled = _a.disabled; const direction = _a.direction;
            child.setData({
                value: value.includes(child.data.name),
                parentDisabled: disabled,
                direction,
            });
        },
    },
});
