"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

(0, component_1.VantComponent)({
    field: true,
    classes: [ "node-class" ],
    props: {
        checked: null,
        loading: Boolean,
        disabled: Boolean,
        activeColor: String,
        inactiveColor: String,
        size: {
            type: String,
            value: "30",
        },
        activeValue: {
            type: null,
            value: true,
        },
        inactiveValue: {
            type: null,
            value: false,
        },
    },
    methods: {
        onClick () {
            const _a = this.data; const activeValue = _a.activeValue; const inactiveValue = _a.inactiveValue; const disabled = _a.disabled; const loading = _a.loading;
            if (disabled || loading) {
                return;
            }
            const checked = this.data.checked === activeValue;
            const value = checked ? inactiveValue : activeValue;
            this.$emit("input", value);
            this.$emit("change", value);
        },
    },
});
