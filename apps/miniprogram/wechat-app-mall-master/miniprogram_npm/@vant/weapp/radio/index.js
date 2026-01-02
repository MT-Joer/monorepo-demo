"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const version_1 = require("../common/version");

(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useParent)("radio-group", function () {
        this.updateFromParent();
    }),
    classes: [ "icon-class", "label-class" ],
    props: {
        name: null,
        value: null,
        disabled: Boolean,
        useIconSlot: Boolean,
        checkedColor: String,
        labelPosition: {
            type: String,
            value: "right",
        },
        labelDisabled: Boolean,
        shape: {
            type: String,
            value: "round",
        },
        iconSize: {
            type: null,
            value: 20,
        },
    },
    data: {
        direction: "",
        parentDisabled: false,
    },
    methods: {
        updateFromParent () {
            if (!this.parent) {
                return;
            }
            const _a = this.parent.data; const value = _a.value; const parentDisabled = _a.disabled; const direction = _a.direction;
            this.setData({
                value,
                direction,
                parentDisabled,
            });
        },
        emitChange (value) {
            const instance = this.parent || this;
            instance.$emit("input", value);
            instance.$emit("change", value);
            if ((0, version_1.canIUseModel)()) {
                instance.setData({ value });
            }
        },
        onChange () {
            if (!this.data.disabled && !this.data.parentDisabled) {
                this.emitChange(this.data.name);
            }
        },
        onClickLabel () {
            const _a = this.data; const disabled = _a.disabled; const parentDisabled = _a.parentDisabled; const labelDisabled = _a.labelDisabled; const name = _a.name;
            if (!(disabled || parentDisabled) && !labelDisabled) {
                this.emitChange(name);
            }
        },
    },
});
