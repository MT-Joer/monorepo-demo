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
const validator_1 = require("../common/validator");

const LONG_PRESS_START_TIME = 600;
const LONG_PRESS_INTERVAL = 200;
// add num and avoid float number
function add(num1, num2) {
    const cardinal = 10**10;
    return Math.round((num1 + num2) * cardinal) / cardinal;
}
function equal(value1, value2) {
    return String(value1) === String(value2);
}
(0, component_1.VantComponent)({
    field: true,
    classes: [ "input-class", "plus-class", "minus-class" ],
    props: {
        value: {
            type: null,
        },
        integer: {
            type: Boolean,
            observer: "check",
        },
        disabled: Boolean,
        inputWidth: String,
        buttonSize: String,
        asyncChange: Boolean,
        disableInput: Boolean,
        decimalLength: {
            type: Number,
            value: null,
            observer: "check",
        },
        min: {
            type: null,
            value: 1,
            observer: "check",
        },
        max: {
            type: null,
            value: Number.MAX_SAFE_INTEGER,
            observer: "check",
        },
        step: {
            type: null,
            value: 1,
        },
        showPlus: {
            type: Boolean,
            value: true,
        },
        showMinus: {
            type: Boolean,
            value: true,
        },
        disablePlus: Boolean,
        disableMinus: Boolean,
        longPress: {
            type: Boolean,
            value: true,
        },
        theme: String,
        alwaysEmbed: Boolean,
    },
    data: {
        currentValue: "",
    },
    watch: {
        value () {
            this.observeValue();
        },
    },
    created () {
        this.setData({
            currentValue: this.format(this.data.value),
        });
    },
    methods: {
        observeValue () {
            const value = this.data.value;
            this.setData({ currentValue: this.format(value) });
        },
        check () {
            const val = this.format(this.data.currentValue);
            if (!equal(val, this.data.currentValue)) {
                this.setData({ currentValue: val });
            }
        },
        isDisabled (type) {
            const _a = this.data; const disabled = _a.disabled; const disablePlus = _a.disablePlus; const disableMinus = _a.disableMinus; const currentValue = _a.currentValue; const max = _a.max; const min = _a.min;
            if (type === "plus") {
                return disabled || disablePlus || +currentValue >= +max;
            }
            return disabled || disableMinus || +currentValue <= +min;
        },
        onFocus (event) {
            this.$emit("focus", event.detail);
        },
        onBlur (event) {
            const value = this.format(event.detail.value);
            this.setData({ currentValue: value });
            this.emitChange(value);
            this.$emit("blur", __assign(__assign({}, event.detail), { value }));
        },
        // filter illegal characters
        filter (value) {
            value = String(value).replaceAll(/[^0-9.-]/g, "");
            if (this.data.integer && value.includes(".")) {
                value = value.split(".")[0];
            }
            return value;
        },
        // limit value range
        format (value) {
            value = this.filter(value);
            // format range
            value = value === "" ? 0 : +value;
            value = Math.max(Math.min(this.data.max, value), this.data.min);
            // format decimal
            if ((0, validator_1.isDef)(this.data.decimalLength)) {
                value = value.toFixed(this.data.decimalLength);
            }
            return value;
        },
        onInput (event) {
            const _a = (event.detail || {}).value; const value = _a === void 0 ? "" : _a;
            // allow input to be empty
            if (value === "") {
                return;
            }
            const formatted = this.format(value);
            this.emitChange(formatted);
        },
        emitChange (value) {
            if (!this.data.asyncChange) {
                this.setData({ currentValue: value });
            }
            this.$emit("change", value);
        },
        onChange () {
            const type = this.type;
            if (this.isDisabled(type)) {
                this.$emit("overlimit", type);
                return;
            }
            const diff = type === "minus" ? -this.data.step : +this.data.step;
            const value = this.format(add(+this.data.currentValue, diff));
            this.emitChange(value);
            this.$emit(type);
        },
        longPressStep () {
            const _this = this;
            this.longPressTimer = setTimeout(() => {
                _this.onChange();
                _this.longPressStep();
            }, LONG_PRESS_INTERVAL);
        },
        onTap (event) {
            const type = event.currentTarget.dataset.type;
            this.type = type;
            this.onChange();
        },
        onTouchStart (event) {
            const _this = this;
            if (!this.data.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
            const type = event.currentTarget.dataset.type;
            this.type = type;
            this.isLongPress = false;
            this.longPressTimer = setTimeout(() => {
                _this.isLongPress = true;
                _this.onChange();
                _this.longPressStep();
            }, LONG_PRESS_START_TIME);
        },
        onTouchEnd () {
            if (!this.data.longPress) {
                return;
            }
            clearTimeout(this.longPressTimer);
        },
    },
});
