"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const animate_1 = require("./animate");

(0, component_1.VantComponent)({
    classes: [ "title-class", "content-class" ],
    relation: (0, relation_1.useParent)("collapse"),
    props: {
        size: String,
        name: null,
        title: null,
        value: null,
        icon: String,
        label: String,
        disabled: Boolean,
        clickable: Boolean,
        border: {
            type: Boolean,
            value: true,
        },
        isLink: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        expanded: false,
    },
    mounted () {
        this.updateExpanded();
        this.mounted = true;
    },
    methods: {
        updateExpanded () {
            if (!this.parent) {
                return;
            }
            const _a = this.parent.data; const value = _a.value; const accordion = _a.accordion;
            const _b = this.parent.children; const children = _b === void 0 ? [] : _b;
            const name = this.data.name;
            const index = children.indexOf(this);
            const currentName = name == null ? index : name;
            const expanded = accordion
                ? value === currentName
                : (value || []).includes(currentName);
            if (expanded !== this.data.expanded) {
                (0, animate_1.setContentAnimate)(this, expanded, this.mounted);
            }
            this.setData({ index, expanded });
        },
        onClick () {
            if (this.data.disabled) {
                return;
            }
            const _a = this.data; const name = _a.name; const expanded = _a.expanded;
            const index = this.parent.children.indexOf(this);
            const currentName = name == null ? index : name;
            this.parent.switch(currentName, !expanded);
        },
    },
});
