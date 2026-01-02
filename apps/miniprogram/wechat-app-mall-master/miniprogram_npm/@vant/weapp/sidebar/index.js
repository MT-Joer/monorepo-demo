"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)("sidebar-item", function () {
        this.setActive(this.data.activeKey);
    }),
    props: {
        activeKey: {
            type: Number,
            value: 0,
            observer: "setActive",
        },
    },
    beforeCreate () {
        this.currentActive = -1;
    },
    methods: {
        setActive (activeKey) {
            const _a = this; const children = _a.children; const currentActive = _a.currentActive;
            if (children.length === 0) {
                return Promise.resolve();
            }
            this.currentActive = activeKey;
            const stack = [];
            if (currentActive !== activeKey && children[currentActive]) {
                stack.push(children[currentActive].setActive(false));
            }
            if (children[activeKey]) {
                stack.push(children[activeKey].setActive(true));
            }
            return Promise.all(stack);
        },
    },
});
