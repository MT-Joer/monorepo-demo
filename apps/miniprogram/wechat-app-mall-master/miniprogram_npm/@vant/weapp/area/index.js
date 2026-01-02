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
const shared_1 = require("../picker/shared");

const EMPTY_CODE = "000000";
(0, component_1.VantComponent)({
    classes: [ "active-class", "toolbar-class", "column-class" ],
    props: __assign(__assign({}, shared_1.pickerProps), { showToolbar: {
        type: Boolean,
        value: true,
    }, value: {
        type: String,
        observer (value) {
            this.code = value;
            this.setValues();
        },
    }, areaList: {
        type: Object,
        value: {},
        observer: "setValues",
    }, columnsNum: {
        type: null,
        value: 3,
    }, columnsPlaceholder: {
        type: Array,
        observer (val) {
            this.setData({
                typeToColumnsPlaceholder: {
                    province: val[0] || "",
                    city: val[1] || "",
                    county: val[2] || "",
                },
            });
        },
    } }),
    data: {
        columns: [ { values: [] }, { values: [] }, { values: [] } ],
        typeToColumnsPlaceholder: {},
    },
    mounted () {
        const _this = this;
        (0, utils_1.requestAnimationFrame)(() => {
            _this.setValues();
        });
    },
    methods: {
        getPicker () {
            if (this.picker == null) {
                this.picker = this.selectComponent(".van-area__picker");
            }
            return this.picker;
        },
        onCancel (event) {
            this.emit("cancel", event.detail);
        },
        onConfirm (event) {
            const index = event.detail.index;
            let value = event.detail.value;
            value = this.parseValues(value);
            this.emit("confirm", { value, index });
        },
        emit (type, detail) {
            detail.values = detail.value;
            delete detail.value;
            this.$emit(type, detail);
        },
        parseValues (values) {
            const columnsPlaceholder = this.data.columnsPlaceholder;
            return values.map((value, index) => {
                if (value &&
                    (!value.code || value.name === columnsPlaceholder[index])) {
                    return __assign(__assign({}, value), { code: "", name: "" });
                }
                return value;
            });
        },
        onChange (event) {
            const _this = this;
            let _a;
            const _b = event.detail; const index = _b.index; const picker = _b.picker; const value = _b.value;
            this.code = value[index].code;
            (_a = this.setValues()) === null || _a === void 0 ? void 0 : _a.then(() => {
                _this.$emit("change", {
                    picker,
                    values: _this.parseValues(picker.getValues()),
                    index,
                });
            });
        },
        getConfig (type) {
            const areaList = this.data.areaList;
            return (areaList && areaList["".concat(type, "_list")]) || {};
        },
        getList (type, code) {
            if (type !== "province" && !code) {
                return [];
            }
            const typeToColumnsPlaceholder = this.data.typeToColumnsPlaceholder;
            const list = this.getConfig(type);
            let result = Object.keys(list).map((code) => { return ({
                code,
                name: list[code],
            }); });
            if (code != null) {
                // oversea code
                if (code[0] === "9" && type === "city") {
                    code = "9";
                }
                result = result.filter((item) => { return item.code.indexOf(code) === 0; });
            }
            if (typeToColumnsPlaceholder[type] && result.length > 0) {
                // set columns placeholder
                const codeFill = type === "province"
                    ? ""
                    : (type === "city"
                        ? EMPTY_CODE.slice(2, 4)
                        : EMPTY_CODE.slice(4, 6));
                result.unshift({
                    code: "".concat(code).concat(codeFill),
                    name: typeToColumnsPlaceholder[type],
                });
            }
            return result;
        },
        getIndex (type, code) {
            let compareNum = type === "province" ? 2 : (type === "city" ? 4 : 6);
            const list = this.getList(type, code.slice(0, compareNum - 2));
            // oversea code
            if (code[0] === "9" && type === "province") {
                compareNum = 1;
            }
            code = code.slice(0, compareNum);
            for (const [ i, element ] of list.entries()) {
                if (element.code.slice(0, compareNum) === code) {
                    return i;
                }
            }
            return 0;
        },
        setValues () {
            const picker = this.getPicker();
            if (!picker) {
                return;
            }
            let code = this.code || this.getDefaultCode();
            const provinceList = this.getList("province");
            const cityList = this.getList("city", code.slice(0, 2));
            const stack = [];
            const indexes = [];
            const columnsNum = this.data.columnsNum;
            if (columnsNum >= 1) {
                stack.push(picker.setColumnValues(0, provinceList, false));
                indexes.push(this.getIndex("province", code));
            }
            if (columnsNum >= 2) {
                stack.push(picker.setColumnValues(1, cityList, false));
                indexes.push(this.getIndex("city", code));
                if (cityList.length > 0 && code.slice(2, 4) === "00") {
                    code = cityList[0].code;
                }
            }
            if (columnsNum === 3) {
                stack.push(picker.setColumnValues(2, this.getList("county", code.slice(0, 4)), false));
                indexes.push(this.getIndex("county", code));
            }
            return Promise.all(stack)
                .catch(() => {})
                .then(() => { return picker.setIndexes(indexes); })
                .catch(() => {});
        },
        getDefaultCode () {
            const columnsPlaceholder = this.data.columnsPlaceholder;
            if (columnsPlaceholder.length > 0) {
                return EMPTY_CODE;
            }
            const countyCodes = Object.keys(this.getConfig("county"));
            if (countyCodes[0]) {
                return countyCodes[0];
            }
            const cityCodes = Object.keys(this.getConfig("city"));
            if (cityCodes[0]) {
                return cityCodes[0];
            }
            return "";
        },
        getValues () {
            const picker = this.getPicker();
            if (!picker) {
                return [];
            }
            return this.parseValues(picker.getValues().filter((value) => { return !!value; }));
        },
        getDetail () {
            const values = this.getValues();
            const area = {
                code: "",
                country: "",
                province: "",
                city: "",
                county: "",
            };
            if (values.length === 0) {
                return area;
            }
            const names = values.map((item) => { return item.name; });
            area.code = values[values.length - 1].code;
            if (area.code[0] === "9") {
                area.country = names[1] || "";
                area.province = names[2] || "";
            }
            else {
                area.province = names[0] || "";
                area.city = names[1] || "";
                area.county = names[2] || "";
            }
            return area;
        },
        reset (code) {
            this.code = code || "";
            return this.setValues();
        },
    },
});
