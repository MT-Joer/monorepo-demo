"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const utils_1 = require("../common/utils");

(0, component_1.VantComponent)({
    relation: (0, relation_1.useParent)("index-bar"),
    props: {
        useSlot: Boolean,
        index: null,
    },
    data: {
        active: false,
        wrapperStyle: "",
        anchorStyle: "",
    },
    methods: {
        scrollIntoView (scrollTop) {
            const _this = this;
            (0, utils_1.getRect)(this, ".van-index-anchor-wrapper").then((rect) => {
                wx.pageScrollTo({
                    duration: 0,
                    scrollTop: scrollTop + rect.top - _this.parent.data.stickyOffsetTop,
                });
            });
        },
    },
});
