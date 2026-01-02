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
const validator_1 = require("../common/validator");
const shared_1 = require("../picker/shared");

const currentYear = new Date().getFullYear();
function isValidDate(date) {
    return (0, validator_1.isDef)(date) && !isNaN(new Date(date).getTime());
}
function range(num, min, max) {
    return Math.min(Math.max(num, min), max);
}
function padZero(val) {
    return "00".concat(val).slice(-2);
}
function times(n, iteratee) {
    let index = -1;
    const result = Array.from({ length: Math.max(n, 0) });
    while (++index < n) {
        result[index] = iteratee(index);
    }
    return result;
}
function getTrueValue(formattedValue) {
    if (formattedValue === undefined) {
        formattedValue = "1";
    }
    while (isNaN(Number.parseInt(formattedValue, 10))) {
        formattedValue = formattedValue.slice(1);
    }
    return Number.parseInt(formattedValue, 10);
}
function getMonthEndDay(year, month) {
    return 32 - new Date(year, month - 1, 32).getDate();
}
const defaultFormatter = function (type, value) { return value; };
(0, component_1.VantComponent)({
    classes: [ "active-class", "toolbar-class", "column-class" ],
    props: __assign(__assign({}, shared_1.pickerProps), { value: {
        type: null,
        observer: "updateValue",
    }, filter: null, type: {
        type: String,
        value: "datetime",
        observer: "updateValue",
    }, showToolbar: {
        type: Boolean,
        value: true,
    }, formatter: {
        type: null,
        value: defaultFormatter,
    }, minDate: {
        type: Number,
        value: new Date(currentYear - 10, 0, 1).getTime(),
        observer: "updateValue",
    }, maxDate: {
        type: Number,
        value: new Date(currentYear + 10, 11, 31).getTime(),
        observer: "updateValue",
    }, minHour: {
        type: Number,
        value: 0,
        observer: "updateValue",
    }, maxHour: {
        type: Number,
        value: 23,
        observer: "updateValue",
    }, minMinute: {
        type: Number,
        value: 0,
        observer: "updateValue",
    }, maxMinute: {
        type: Number,
        value: 59,
        observer: "updateValue",
    } }),
    data: {
        innerValue: Date.now(),
        columns: [],
    },
    methods: {
        updateValue () {
            const _this = this;
            const data = this.data;
            const val = this.correctValue(data.value);
            const isEqual = val === data.innerValue;
            this.updateColumnValue(val).then(() => {
                if (!isEqual) {
                    _this.$emit("input", val);
                }
            });
        },
        getPicker () {
            if (this.picker == null) {
                this.picker = this.selectComponent(".van-datetime-picker");
                const picker_1 = this.picker;
                const setColumnValues_1 = picker_1.setColumnValues;
                picker_1.setColumnValues = function () {
                    const args = [];
                    for (const [ _i, argument ] of arguments.entries()) {
                        args[_i] = argument;
                    }
                    return setColumnValues_1.apply(picker_1, __spreadArray(__spreadArray([], args, true), [ false ], false));
                };
            }
            return this.picker;
        },
        updateColumns () {
            const _a = this.data.formatter; const formatter = _a === void 0 ? defaultFormatter : _a;
            const results = this.getOriginColumns().map((column) => { return ({
                values: column.values.map((value) => { return formatter(column.type, value); }),
            }); });
            return this.set({ columns: results });
        },
        getOriginColumns () {
            const filter = this.data.filter;
            const results = this.getRanges().map((_a) => {
                const range = _a.range; const type = _a.type;
                let values = times(range[1] - range[0] + 1, (index) => {
                    const value = range[0] + index;
                    return type === "year" ? "".concat(value) : padZero(value);
                });
                if (filter) {
                    values = filter(type, values);
                }
                return { type, values };
            });
            return results;
        },
        getRanges () {
            const data = this.data;
            if (data.type === "time") {
                return [
                    {
                        type: "hour",
                        range: [ data.minHour, data.maxHour ],
                    },
                    {
                        type: "minute",
                        range: [ data.minMinute, data.maxMinute ],
                    },
                ];
            }
            const _a = this.getBoundary("max", data.innerValue); const maxYear = _a.maxYear; const maxDate = _a.maxDate; const maxMonth = _a.maxMonth; const maxHour = _a.maxHour; const maxMinute = _a.maxMinute;
            const _b = this.getBoundary("min", data.innerValue); const minYear = _b.minYear; const minDate = _b.minDate; const minMonth = _b.minMonth; const minHour = _b.minHour; const minMinute = _b.minMinute;
            const result = [
                {
                    type: "year",
                    range: [ minYear, maxYear ],
                },
                {
                    type: "month",
                    range: [ minMonth, maxMonth ],
                },
                {
                    type: "day",
                    range: [ minDate, maxDate ],
                },
                {
                    type: "hour",
                    range: [ minHour, maxHour ],
                },
                {
                    type: "minute",
                    range: [ minMinute, maxMinute ],
                },
            ];
            if (data.type === "date")
                result.splice(3, 2);
            if (data.type === "year-month")
                result.splice(2, 3);
            return result;
        },
        correctValue (value) {
            const data = this.data;
            // validate value
            const isDateType = data.type !== "time";
            if (isDateType && !isValidDate(value)) {
                value = data.minDate;
            }
            else if (!isDateType && !value) {
                const minHour = data.minHour;
                value = "".concat(padZero(minHour), ":00");
            }
            // time type
            if (!isDateType) {
                const _a = value.split(":"); let hour = _a[0]; let minute = _a[1];
                hour = padZero(range(hour, data.minHour, data.maxHour));
                minute = padZero(range(minute, data.minMinute, data.maxMinute));
                return "".concat(hour, ":").concat(minute);
            }
            // date type
            value = Math.max(value, data.minDate);
            value = Math.min(value, data.maxDate);
            return value;
        },
        getBoundary (type, innerValue) {
            let _a;
            const value = new Date(innerValue);
            const boundary = new Date(this.data["".concat(type, "Date")]);
            const year = boundary.getFullYear();
            let month = 1;
            let date = 1;
            let hour = 0;
            let minute = 0;
            if (type === "max") {
                month = 12;
                date = getMonthEndDay(value.getFullYear(), value.getMonth() + 1);
                hour = 23;
                minute = 59;
            }
            if (value.getFullYear() === year) {
                month = boundary.getMonth() + 1;
                if (value.getMonth() + 1 === month) {
                    date = boundary.getDate();
                    if (value.getDate() === date) {
                        hour = boundary.getHours();
                        if (value.getHours() === hour) {
                            minute = boundary.getMinutes();
                        }
                    }
                }
            }
            return _a = {},
            _a["".concat(type, "Year")] = year,
            _a["".concat(type, "Month")] = month,
            _a["".concat(type, "Date")] = date,
            _a["".concat(type, "Hour")] = hour,
            _a["".concat(type, "Minute")] = minute,
            _a;
        },
        onCancel () {
            this.$emit("cancel");
        },
        onConfirm () {
            this.$emit("confirm", this.data.innerValue);
        },
        onChange () {
            const _this = this;
            const data = this.data;
            let value;
            const picker = this.getPicker();
            const originColumns = this.getOriginColumns();
            if (data.type === "time") {
                var indexes = picker.getIndexes();
                value = "".concat(+originColumns[0].values[indexes[0]], ":").concat(+originColumns[1]
                    .values[indexes[1]]);
            }
            else {
                var indexes = picker.getIndexes();
                const values = indexes.map((value, index) => { return originColumns[index].values[value]; });
                const year = getTrueValue(values[0]);
                const month = getTrueValue(values[1]);
                const maxDate = getMonthEndDay(year, month);
                let date = getTrueValue(values[2]);
                if (data.type === "year-month") {
                    date = 1;
                }
                date = Math.min(date, maxDate);
                let hour = 0;
                let minute = 0;
                if (data.type === "datetime") {
                    hour = getTrueValue(values[3]);
                    minute = getTrueValue(values[4]);
                }
                value = new Date(year, month - 1, date, hour, minute);
            }
            value = this.correctValue(value);
            this.updateColumnValue(value).then(() => {
                _this.$emit("input", value);
                _this.$emit("change", picker);
            });
        },
        updateColumnValue (value) {
            const _this = this;
            let values = [];
            const type = this.data.type;
            const formatter = this.data.formatter || defaultFormatter;
            const picker = this.getPicker();
            if (type === "time") {
                const pair = value.split(":");
                values = [ formatter("hour", pair[0]), formatter("minute", pair[1]) ];
            }
            else {
                const date = new Date(value);
                values = [
                    formatter("year", "".concat(date.getFullYear())),
                    formatter("month", padZero(date.getMonth() + 1)),
                ];
                if (type === "date") {
                    values.push(formatter("day", padZero(date.getDate())));
                }
                if (type === "datetime") {
                    values.push(formatter("day", padZero(date.getDate())), formatter("hour", padZero(date.getHours())), formatter("minute", padZero(date.getMinutes())));
                }
            }
            return this.set({ innerValue: value })
                .then(() => { return _this.updateColumns(); })
                .then(() => { return picker.setValues(values); });
        },
    },
    created () {
        const _this = this;
        const innerValue = this.correctValue(this.data.value);
        this.updateColumnValue(innerValue).then(() => {
            _this.$emit("input", innerValue);
        });
    },
});
