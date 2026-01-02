"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    classes: [ "active-class", "disabled-class" ],
    relation: (0, relation_1.useParent)("sidebar"),
    props: {
        dot: Boolean,
        badge: null,
        info: null,
        title: String,
        disabled: Boolean,
    },
    methods: {
        onClick () {
            const _this = this;
            const parent = this.parent;
            if (!parent || this.data.disabled) {
                return;
            }
            const index = parent.children.indexOf(this);
            parent.setActive(index).then(() => {
                _this.$emit("click", index);
                parent.$emit("change", index);
            });
        },
        setActive (selected) {
            return this.setData({ selected });
        },
    },
});
