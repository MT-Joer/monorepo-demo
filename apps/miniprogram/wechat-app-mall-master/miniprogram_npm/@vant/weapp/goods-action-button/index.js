"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const button_1 = require("../mixins/button");
const link_1 = require("../mixins/link");

(0, component_1.VantComponent)({
    mixins: [ link_1.link, button_1.button ],
    relation: (0, relation_1.useParent)("goods-action"),
    props: {
        text: String,
        color: String,
        size: {
            type: String,
            value: "normal",
        },
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        type: {
            type: String,
            value: "danger",
        },
        customStyle: {
            type: String,
            value: "",
        },
    },
    methods: {
        onClick (event) {
            this.$emit("click", event.detail);
            this.jumpLink();
        },
        updateStyle () {
            if (this.parent == null) {
                return;
            }
            const index = this.index;
            const _a = this.parent.children; const children = _a === void 0 ? [] : _a;
            this.setData({
                isFirst: index === 0,
                isLast: index === children.length - 1,
            });
        },
    },
});
