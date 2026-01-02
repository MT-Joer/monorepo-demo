"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const link_1 = require("../mixins/link");

(0, component_1.VantComponent)({
    relation: (0, relation_1.useParent)("grid"),
    classes: [ "content-class", "icon-class", "text-class" ],
    mixins: [ link_1.link ],
    props: {
        icon: String,
        iconColor: String,
        iconPrefix: {
            type: String,
            value: "van-icon",
        },
        dot: Boolean,
        info: null,
        badge: null,
        text: String,
        useSlot: Boolean,
    },
    data: {
        viewStyle: "",
    },
    mounted () {
        this.updateStyle();
    },
    methods: {
        updateStyle () {
            if (!this.parent) {
                return;
            }
            const _a = this.parent; const data = _a.data; const children = _a.children;
            const border = data.border; const center = data.center; const clickable = data.clickable; const columnNum = data.columnNum; const direction = data.direction; const gutter = data.gutter; const iconSize = data.iconSize; const reverse = data.reverse; const square = data.square;
            this.setData({
                center,
                border,
                square,
                gutter,
                clickable,
                direction,
                reverse,
                iconSize,
                index: children.indexOf(this),
                columnNum,
            });
        },
        onClick () {
            this.$emit("click");
            this.jumpLink();
        },
    },
});
