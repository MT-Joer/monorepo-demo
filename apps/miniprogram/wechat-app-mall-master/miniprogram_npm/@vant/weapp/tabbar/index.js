"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const utils_1 = require("../common/utils");

(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)("tabbar-item", function () {
        this.updateChildren();
    }),
    props: {
        active: {
            type: null,
            observer: "updateChildren",
        },
        activeColor: {
            type: String,
            observer: "updateChildren",
        },
        inactiveColor: {
            type: String,
            observer: "updateChildren",
        },
        fixed: {
            type: Boolean,
            value: true,
            observer: "setHeight",
        },
        placeholder: {
            type: Boolean,
            observer: "setHeight",
        },
        border: {
            type: Boolean,
            value: true,
        },
        zIndex: {
            type: Number,
            value: 1,
        },
        safeAreaInsetBottom: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        height: 50,
    },
    methods: {
        updateChildren () {
            const children = this.children;
            if (!Array.isArray(children) || children.length === 0) {
                return;
            }
            children.forEach((child) => { return child.updateFromParent(); });
        },
        setHeight () {
            const _this = this;
            if (!this.data.fixed || !this.data.placeholder) {
                return;
            }
            wx.nextTick(() => {
                (0, utils_1.getRect)(_this, ".van-tabbar").then((res) => {
                    _this.setData({ height: res.height });
                });
            });
        },
    },
});
