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
const component_1 = require("../../../common/component");

(0, component_1.VantComponent)({
    props: {
        title: {
            type: String,
            value: "日期选择",
        },
        subtitle: String,
        showTitle: Boolean,
        showSubtitle: Boolean,
        firstDayOfWeek: {
            type: Number,
            observer: "initWeekDay",
        },
    },
    data: {
        weekdays: [],
    },
    created () {
        this.initWeekDay();
    },
    methods: {
        initWeekDay () {
            const defaultWeeks = [ "日", "一", "二", "三", "四", "五", "六" ];
            const firstDayOfWeek = this.data.firstDayOfWeek || 0;
            this.setData({
                weekdays: __spreadArray(__spreadArray([], defaultWeeks.slice(firstDayOfWeek, 7), true), defaultWeeks.slice(0, firstDayOfWeek), true),
            });
        },
        onClickSubtitle (event) {
            this.$emit("click-subtitle", event);
        },
    },
});
