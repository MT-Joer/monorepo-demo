"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var i = 1, n = arguments.length, s; i < n; i++) {
            s = arguments[i];
            for (const p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return Reflect.apply(__assign, this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

(0, component_1.VantComponent)({
    props: {
        options: Array,
        showBorder: Boolean,
    },
    methods: {
        onSelect (event) {
            const index = event.currentTarget.dataset.index;
            const option = this.data.options[index];
            this.$emit("select", __assign(__assign({}, option), { index }));
        },
    },
});
