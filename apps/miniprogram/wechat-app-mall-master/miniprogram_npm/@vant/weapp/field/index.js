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
const utils_1 = require("../common/utils");
const props_1 = require("./props");

(0, component_1.VantComponent)({
    field: true,
    classes: [ "input-class", "right-icon-class", "label-class" ],
    props: __assign(__assign(__assign(__assign({}, props_1.commonProps), props_1.inputProps), props_1.textareaProps), { size: String, icon: String, label: String, error: Boolean, center: Boolean, isLink: Boolean, leftIcon: String, rightIcon: String, autosize: null, required: Boolean, iconClass: String, clickable: Boolean, inputAlign: String, customStyle: String, errorMessage: String, arrowDirection: String, showWordLimit: Boolean, errorMessageAlign: String, readonly: {
        type: Boolean,
        observer: "setShowClear",
    }, clearable: {
        type: Boolean,
        observer: "setShowClear",
    }, clearTrigger: {
        type: String,
        value: "focus",
    }, border: {
        type: Boolean,
        value: true,
    }, titleWidth: {
        type: String,
        value: "6.2em",
    }, clearIcon: {
        type: String,
        value: "clear",
    }, extraEventParams: {
        type: Boolean,
        value: false,
    } }),
    data: {
        focused: false,
        innerValue: "",
        showClear: false,
    },
    watch: {
        value (value) {
            if (value !== this.value) {
                this.setData({ innerValue: value });
                this.value = value;
                this.setShowClear();
            }
        },
        clearTrigger () {
            this.setShowClear();
        },
    },
    created () {
        this.value = this.data.value;
        this.setData({ innerValue: this.value });
    },
    methods: {
        formatValue (value) {
            const maxlength = this.data.maxlength;
            if (maxlength !== -1 && value.length > maxlength) {
                return value.slice(0, maxlength);
            }
            return value;
        },
        onInput (event) {
            const _a = (event.detail || {}).value; const value = _a === void 0 ? "" : _a;
            const formatValue = this.formatValue(value);
            this.value = formatValue;
            this.setShowClear();
            return this.emitChange(__assign(__assign({}, event.detail), { value: formatValue }));
        },
        onFocus (event) {
            this.focused = true;
            this.setShowClear();
            this.$emit("focus", event.detail);
        },
        onBlur (event) {
            this.focused = false;
            this.setShowClear();
            this.$emit("blur", event.detail);
        },
        onClickIcon () {
            this.$emit("click-icon");
        },
        onClickInput (event) {
            this.$emit("click-input", event.detail);
        },
        onClear () {
            const _this = this;
            this.setData({ innerValue: "" });
            this.value = "";
            this.setShowClear();
            (0, utils_1.nextTick)(() => {
                _this.emitChange({ value: "" });
                _this.$emit("clear", "");
            });
        },
        onConfirm (event) {
            const _a = (event.detail || {}).value; const value = _a === void 0 ? "" : _a;
            this.value = value;
            this.setShowClear();
            this.$emit("confirm", value);
        },
        setValue (value) {
            this.value = value;
            this.setShowClear();
            if (value === "") {
                this.setData({ innerValue: "" });
            }
            this.emitChange({ value });
        },
        onLineChange (event) {
            this.$emit("linechange", event.detail);
        },
        onKeyboardHeightChange (event) {
            this.$emit("keyboardheightchange", event.detail);
        },
        onBindNicknameReview (event) {
            this.$emit("nicknamereview", event.detail);
        },
        emitChange (detail) {
            const extraEventParams = this.data.extraEventParams;
            this.setData({ value: detail.value });
            let result;
            const data = extraEventParams
                ? __assign(__assign({}, detail), { callback (data) {
                    result = data;
                } }) : detail.value;
            this.$emit("input", data);
            this.$emit("change", data);
            return result;
        },
        setShowClear () {
            const _a = this.data; const clearable = _a.clearable; const readonly = _a.readonly; const clearTrigger = _a.clearTrigger;
            const _b = this; const focused = _b.focused; const value = _b.value;
            let showClear = false;
            if (clearable && !readonly) {
                const hasValue = !!value;
                const trigger = clearTrigger === "always" || (clearTrigger === "focus" && focused);
                showClear = hasValue && trigger;
            }
            this.setView({ showClear });
        },
        noop () {},
    },
});
