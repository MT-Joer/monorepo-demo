"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    props: {
        info: null,
        name: null,
        icon: String,
        dot: Boolean,
        url: {
            type: String,
            value: "",
        },
        linkType: {
            type: String,
            value: "redirectTo",
        },
        iconPrefix: {
            type: String,
            value: "van-icon",
        },
    },
    relation: (0, relation_1.useParent)("tabbar"),
    data: {
        active: false,
        activeColor: "",
        inactiveColor: "",
    },
    methods: {
        onClick () {
            const parent = this.parent;
            if (parent) {
                const index = parent.children.indexOf(this);
                const active = this.data.name || index;
                if (active !== this.data.active) {
                    parent.$emit("change", active);
                }
            }
            const _a = this.data; const url = _a.url; const linkType = _a.linkType;
            if (url && wx[linkType]) {
                return wx[linkType]({ url });
            }
            this.$emit("click");
        },
        updateFromParent () {
            const parent = this.parent;
            if (!parent) {
                return;
            }
            const index = parent.children.indexOf(this);
            const parentData = parent.data;
            const data = this.data;
            const active = (data.name || index) === parentData.active;
            const patch = {};
            if (active !== data.active) {
                patch.active = active;
            }
            if (parentData.activeColor !== data.activeColor) {
                patch.activeColor = parentData.activeColor;
            }
            if (parentData.inactiveColor !== data.inactiveColor) {
                patch.inactiveColor = parentData.inactiveColor;
            }
            if (Object.keys(patch).length > 0) {
                this.setData(patch);
            }
        },
    },
});
