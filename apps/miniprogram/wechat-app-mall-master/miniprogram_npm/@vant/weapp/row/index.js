"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)("col", function (target) {
        const gutter = this.data.gutter;
        if (gutter) {
            target.setData({ gutter });
        }
    }),
    props: {
        gutter: {
            type: Number,
            observer: "setGutter",
        },
    },
    methods: {
        setGutter () {
            const _this = this;
            this.children.forEach((col) => {
                col.setData(_this.data);
            });
        },
    },
});
