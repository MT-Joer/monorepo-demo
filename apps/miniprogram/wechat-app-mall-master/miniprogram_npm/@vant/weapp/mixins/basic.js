"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.basic = void 0;
exports.basic = Behavior({
    methods: {
        $emit (name, detail, options) {
            this.triggerEvent(name, detail, options);
        },
        set (data) {
            this.setData(data);
            return new Promise((resolve) => { return wx.nextTick(resolve); });
        },
        // high performance setData
        setView (data, callback) {
            const _this = this;
            const target = {};
            let hasChange = false;
            Object.keys(data).forEach((key) => {
                if (data[key] !== _this.data[key]) {
                    target[key] = data[key];
                    hasChange = true;
                }
            });
            if (hasChange) {
                return this.setData(target, callback);
            }
            return callback && callback();
        },
    },
});
