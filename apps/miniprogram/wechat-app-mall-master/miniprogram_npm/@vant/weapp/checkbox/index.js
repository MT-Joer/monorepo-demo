"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

function emit(target, value) {
    target.$emit("input", value);
    target.$emit("change", value);
}
(0, component_1.VantComponent)({
    field: true,
    relation: (0, relation_1.useParent)("checkbox-group"),
    classes: [ "icon-class", "label-class" ],
    props: {
        value: Boolean,
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
        parentDisabled: false,
        direction: "vertical",
    },
    methods: {
        emitChange (value) {
            if (this.parent) {
                this.setParentValue(this.parent, value);
            }
            else {
                emit(this, value);
            }
        },
        toggle () {
            const _a = this.data; const parentDisabled = _a.parentDisabled; const disabled = _a.disabled; const value = _a.value;
            if (!disabled && !parentDisabled) {
                this.emitChange(!value);
            }
        },
        onClickLabel () {
            const _a = this.data; const labelDisabled = _a.labelDisabled; const parentDisabled = _a.parentDisabled; const disabled = _a.disabled; const value = _a.value;
            if (!disabled && !labelDisabled && !parentDisabled) {
                this.emitChange(!value);
            }
        },
        setParentValue (parent, value) {
            const parentValue = [ ...parent.data.value ];
            const name = this.data.name;
            const max = parent.data.max;
            if (value) {
                if (max && parentValue.length >= max) {
                    return;
                }
                if (!parentValue.includes(name)) {
                    parentValue.push(name);
                    emit(parent, parentValue);
                }
            }
            else {
                const index = parentValue.indexOf(name);
                if (index !== -1) {
                    parentValue.splice(index, 1);
                    emit(parent, parentValue);
                }
            }
        },
    },
});
