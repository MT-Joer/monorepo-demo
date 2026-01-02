"use strict";
const __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var ar, i = 0, l = from.length; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");

let FieldName;
(function (FieldName) {
    FieldName.TEXT = "text";
    FieldName.VALUE = "value";
    FieldName.CHILDREN = "children";
})(FieldName || (FieldName = {}));
const defaultFieldNames = {
    text: FieldName.TEXT,
    value: FieldName.VALUE,
    children: FieldName.CHILDREN,
};
(0, component_1.VantComponent)({
    props: {
        title: String,
        value: {
            type: String,
        },
        placeholder: {
            type: String,
            value: "请选择",
        },
        activeColor: {
            type: String,
            value: "#1989fa",
        },
        options: {
            type: Array,
            value: [],
        },
        swipeable: {
            type: Boolean,
            value: false,
        },
        closeable: {
            type: Boolean,
            value: true,
        },
        showHeader: {
            type: Boolean,
            value: true,
        },
        closeIcon: {
            type: String,
            value: "cross",
        },
        fieldNames: {
            type: Object,
            value: defaultFieldNames,
            observer: "updateFieldNames",
        },
        useTitleSlot: Boolean,
    },
    data: {
        tabs: [],
        activeTab: 0,
        textKey: FieldName.TEXT,
        valueKey: FieldName.VALUE,
        childrenKey: FieldName.CHILDREN,
        innerValue: "",
    },
    watch: {
        options () {
            this.updateTabs();
        },
        value (newVal) {
            this.updateValue(newVal);
        },
    },
    created () {
        this.updateTabs();
    },
    methods: {
        updateValue (val) {
            const _this = this;
            if (val !== undefined) {
                const values = this.data.tabs.map((tab) => { return tab.selected && tab.selected[_this.data.valueKey]; });
                if (values.includes(val)) {
                    return;
                }
            }
            this.innerValue = val;
            this.updateTabs();
        },
        updateFieldNames () {
            const _a = this.data.fieldNames || defaultFieldNames; const _b = _a.text; const text = _b === void 0 ? "text" : _b; const _c = _a.value; const value = _c === void 0 ? "value" : _c; const _d = _a.children; const children = _d === void 0 ? "children" : _d;
            this.setData({
                textKey: text,
                valueKey: value,
                childrenKey: children,
            });
        },
        getSelectedOptionsByValue (options, value) {
            for (const option of options) {
                if (option[this.data.valueKey] === value) {
                    return [ option ];
                }
                if (option[this.data.childrenKey]) {
                    const selectedOptions = this.getSelectedOptionsByValue(option[this.data.childrenKey], value);
                    if (selectedOptions) {
                        return __spreadArray([ option ], selectedOptions, true);
                    }
                }
            }
        },
        updateTabs () {
            const _this = this;
            const options = this.data.options;
            const innerValue = this.innerValue;
            if (options.length === 0) {
                return;
            }
            if (innerValue !== undefined) {
                const selectedOptions = this.getSelectedOptionsByValue(options, innerValue);
                if (selectedOptions) {
                    let optionsCursor_1 = options;
                    const tabs_1 = selectedOptions.map((option) => {
                        const tab = {
                            options: optionsCursor_1,
                            selected: option,
                        };
                        const next = optionsCursor_1.find((item) => { return item[_this.data.valueKey] === option[_this.data.valueKey]; });
                        if (next) {
                            optionsCursor_1 = next[_this.data.childrenKey];
                        }
                        return tab;
                    });
                    if (optionsCursor_1) {
                        tabs_1.push({
                            options: optionsCursor_1,
                            selected: null,
                        });
                    }
                    this.setData({
                        tabs: tabs_1,
                    });
                    wx.nextTick(() => {
                        _this.setData({
                            activeTab: tabs_1.length - 1,
                        });
                    });
                    return;
                }
            }
            this.setData({
                tabs: [
                    {
                        options,
                        selected: null,
                    },
                ],
                activeTab: 0,
            });
        },
        onClose () {
            this.$emit("close");
        },
        onClickTab (e) {
            const _a = e.detail; const tabIndex = _a.index; const title = _a.title;
            this.$emit("click-tab", { title, tabIndex });
            this.setData({
                activeTab: tabIndex,
            });
        },
        // 选中
        onSelect (e) {
            const _this = this;
            const _a = e.currentTarget.dataset; const option = _a.option; const tabIndex = _a.tabIndex;
            if (option && option.disabled) {
                return;
            }
            const _b = this.data; const valueKey = _b.valueKey; const childrenKey = _b.childrenKey;
            let tabs = this.data.tabs;
            tabs[tabIndex].selected = option;
            if (tabs.length > tabIndex + 1) {
                tabs = tabs.slice(0, tabIndex + 1);
            }
            if (option[childrenKey]) {
                const nextTab = {
                    options: option[childrenKey],
                    selected: null,
                };
                if (tabs[tabIndex + 1]) {
                    tabs[tabIndex + 1] = nextTab;
                }
                else {
                    tabs.push(nextTab);
                }
                wx.nextTick(() => {
                    _this.setData({
                        activeTab: tabIndex + 1,
                    });
                });
            }
            this.setData({
                tabs,
            });
            const selectedOptions = tabs.map((tab) => { return tab.selected; }).filter(Boolean);
            const value = option[valueKey];
            const params = {
                value,
                tabIndex,
                selectedOptions,
            };
            this.innerValue = value;
            this.$emit("change", params);
            if (!option[childrenKey]) {
                this.$emit("finish", params);
            }
        },
    },
});
