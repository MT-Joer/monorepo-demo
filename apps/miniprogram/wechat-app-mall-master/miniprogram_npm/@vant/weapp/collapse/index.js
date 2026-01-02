"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    relation: (0, relation_1.useChildren)("collapse-item"),
    props: {
        value: {
            type: null,
            observer: "updateExpanded",
        },
        accordion: {
            type: Boolean,
            observer: "updateExpanded",
        },
        border: {
            type: Boolean,
            value: true,
        },
    },
    methods: {
        updateExpanded () {
            this.children.forEach((child) => {
                child.updateExpanded();
            });
        },
        switch (name, expanded) {
            const _a = this.data; const accordion = _a.accordion; const value = _a.value;
            const changeItem = name;
            if (accordion) {
                name = expanded ? name : "";
            }
            else {
                name = expanded
                    ? (value || []).concat(name)
                    : (value || []).filter((activeName) => { return activeName !== name; });
            }
            if (expanded) {
                this.$emit("open", changeItem);
            }
            else {
                this.$emit("close", changeItem);
            }
            this.$emit("change", name);
            this.$emit("input", name);
        },
    },
});
