"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../../../common/component");
const utils_1 = require("../../utils");

(0, component_1.VantComponent)({
    props: {
        date: {
            type: null,
            observer: "setDays",
        },
        type: {
            type: String,
            observer: "setDays",
        },
        color: String,
        minDate: {
            type: null,
            observer: "setDays",
        },
        maxDate: {
            type: null,
            observer: "setDays",
        },
        showMark: Boolean,
        rowHeight: null,
        formatter: {
            type: null,
            observer: "setDays",
        },
        currentDate: {
            type: null,
            observer: "setDays",
        },
        firstDayOfWeek: {
            type: Number,
            observer: "setDays",
        },
        allowSameDay: Boolean,
        showSubtitle: Boolean,
        showMonthTitle: Boolean,
    },
    data: {
        visible: true,
        days: [],
    },
    methods: {
        onClick (event) {
            const index = event.currentTarget.dataset.index;
            const item = this.data.days[index];
            if (item.type !== "disabled") {
                this.$emit("click", item);
            }
        },
        setDays () {
            const days = [];
            const startDate = new Date(this.data.date);
            const year = startDate.getFullYear();
            const month = startDate.getMonth();
            const totalDay = (0, utils_1.getMonthEndDay)(startDate.getFullYear(), startDate.getMonth() + 1);
            for (let day = 1; day <= totalDay; day++) {
                const date = new Date(year, month, day);
                const type = this.getDayType(date);
                let config = {
                    date,
                    type,
                    text: day,
                    bottomInfo: this.getBottomInfo(type),
                };
                if (this.data.formatter) {
                    config = this.data.formatter(config);
                }
                days.push(config);
            }
            this.setData({ days });
        },
        getMultipleDayType (day) {
            const currentDate = this.data.currentDate;
            if (!Array.isArray(currentDate)) {
                return "";
            }
            const isSelected = function (date) {
                return currentDate.some((item) => { return (0, utils_1.compareDay)(item, date) === 0; });
            };
            if (isSelected(day)) {
                const prevDay = (0, utils_1.getPrevDay)(day);
                const nextDay = (0, utils_1.getNextDay)(day);
                const prevSelected = isSelected(prevDay);
                const nextSelected = isSelected(nextDay);
                if (prevSelected && nextSelected) {
                    return "multiple-middle";
                }
                if (prevSelected) {
                    return "end";
                }
                return nextSelected ? "start" : "multiple-selected";
            }
            return "";
        },
        getRangeDayType (day) {
            const _a = this.data; const currentDate = _a.currentDate; const allowSameDay = _a.allowSameDay;
            if (!Array.isArray(currentDate)) {
                return "";
            }
            const endDay = currentDate[1]; const startDay = currentDate[0];
            if (!startDay) {
                return "";
            }
            const compareToStart = (0, utils_1.compareDay)(day, startDay);
            if (!endDay) {
                return compareToStart === 0 ? "start" : "";
            }
            const compareToEnd = (0, utils_1.compareDay)(day, endDay);
            if (compareToStart === 0 && compareToEnd === 0 && allowSameDay) {
                return "start-end";
            }
            if (compareToStart === 0) {
                return "start";
            }
            if (compareToEnd === 0) {
                return "end";
            }
            if (compareToStart > 0 && compareToEnd < 0) {
                return "middle";
            }
            return "";
        },
        getDayType (day) {
            const _a = this.data; const type = _a.type; const minDate = _a.minDate; const maxDate = _a.maxDate; const currentDate = _a.currentDate;
            if ((0, utils_1.compareDay)(day, minDate) < 0 || (0, utils_1.compareDay)(day, maxDate) > 0) {
                return "disabled";
            }
            if (type === "single") {
                return (0, utils_1.compareDay)(day, currentDate) === 0 ? "selected" : "";
            }
            if (type === "multiple") {
                return this.getMultipleDayType(day);
            }
            /* istanbul ignore else */
            if (type === "range") {
                return this.getRangeDayType(day);
            }
            return "";
        },
        getBottomInfo (type) {
            if (this.data.type === "range") {
                if (type === "start") {
                    return "开始";
                }
                if (type === "end") {
                    return "结束";
                }
                if (type === "start-end") {
                    return "开始/结束";
                }
            }
        },
    },
});
