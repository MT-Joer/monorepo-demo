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
const shared_1 = require("./shared");

(0, component_1.VantComponent)({
    classes: [ "active-class", "toolbar-class", "column-class" ],
    props: __assign(__assign({}, shared_1.pickerProps), { valueKey: {
        type: String,
        value: "text",
    }, toolbarPosition: {
        type: String,
        value: "top",
    }, defaultIndex: {
        type: Number,
        value: 0,
    }, columns: {
        type: Array,
        value: [],
        observer (columns) {
            if (columns === void 0) { columns = []; }
            this.simple = columns.length && !columns[0].values;
            if (Array.isArray(this.children) && this.children.length > 0) {
                this.setColumns().catch(() => {});
            }
        },
    } }),
    beforeCreate () {
        const _this = this;
        Object.defineProperty(this, "children", {
            get () { return _this.selectAllComponents(".van-picker__column") || []; },
        });
    },
    methods: {
        noop () {},
        setColumns () {
            const _this = this;
            const data = this.data;
            const columns = this.simple ? [ { values: data.columns } ] : data.columns;
            const stack = columns.map((column, index) => {
                return _this.setColumnValues(index, column.values);
            });
            return Promise.all(stack);
        },
        emit (event) {
            const type = event.currentTarget.dataset.type;
            if (this.simple) {
                this.$emit(type, {
                    value: this.getColumnValue(0),
                    index: this.getColumnIndex(0),
                });
            }
            else {
                this.$emit(type, {
                    value: this.getValues(),
                    index: this.getIndexes(),
                });
            }
        },
        onChange (event) {
            if (this.simple) {
                this.$emit("change", {
                    picker: this,
                    value: this.getColumnValue(0),
                    index: this.getColumnIndex(0),
                });
            }
            else {
                this.$emit("change", {
                    picker: this,
                    value: this.getValues(),
                    index: event.currentTarget.dataset.index,
                });
            }
        },
        // get column instance by index
        getColumn (index) {
            return this.children[index];
        },
        // get column value by index
        getColumnValue (index) {
            const column = this.getColumn(index);
            return column && column.getValue();
        },
        // set column value by index
        setColumnValue (index, value) {
            const column = this.getColumn(index);
            if (column == null) {
                return Promise.reject(new Error("setColumnValue: 对应列不存在"));
            }
            return column.setValue(value);
        },
        // get column option index by column index
        getColumnIndex (columnIndex) {
            return (this.getColumn(columnIndex) || {}).data.currentIndex;
        },
        // set column option index by column index
        setColumnIndex (columnIndex, optionIndex) {
            const column = this.getColumn(columnIndex);
            if (column == null) {
                return Promise.reject(new Error("setColumnIndex: 对应列不存在"));
            }
            return column.setIndex(optionIndex);
        },
        // get options of column by index
        getColumnValues (index) {
            return (this.children[index] || {}).data.options;
        },
        // set options of column by index
        setColumnValues (index, options, needReset) {
            if (needReset === void 0) { needReset = true; }
            const column = this.children[index];
            if (column == null) {
                return Promise.reject(new Error("setColumnValues: 对应列不存在"));
            }
            const isSame = JSON.stringify(column.data.options) === JSON.stringify(options);
            if (isSame) {
                return Promise.resolve();
            }
            return column.set({ options }).then(() => {
                if (needReset) {
                    column.setIndex(0);
                }
            });
        },
        // get values of all columns
        getValues () {
            return this.children.map((child) => { return child.getValue(); });
        },
        // set values of all columns
        setValues (values) {
            const _this = this;
            const stack = values.map((value, index) => {
                return _this.setColumnValue(index, value);
            });
            return Promise.all(stack);
        },
        // get indexes of all columns
        getIndexes () {
            return this.children.map((child) => { return child.data.currentIndex; });
        },
        // set indexes of all columns
        setIndexes (indexes) {
            const _this = this;
            const stack = indexes.map((optionIndex, columnIndex) => {
                return _this.setColumnIndex(columnIndex, optionIndex);
            });
            return Promise.all(stack);
        },
    },
});
