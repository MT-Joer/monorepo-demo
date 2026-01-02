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
const color_1 = require("../common/color");

const defaultOptions = {
    selector: "#van-notify",
    type: "danger",
    message: "",
    background: "",
    duration: 3000,
    zIndex: 110,
    top: 0,
    color: color_1.WHITE,
    safeAreaInsetTop: false,
    onClick () {},
    onOpened () {},
    onClose () {},
};
let currentOptions = __assign({}, defaultOptions);
function parseOptions(message) {
    if (message == null) {
        return {};
    }
    return typeof message === "string" ? { message } : message;
}
function getContext() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
}
function Notify(options) {
    options = __assign(__assign({}, currentOptions), parseOptions(options));
    const context = options.context || getContext();
    const notify = context.selectComponent(options.selector);
    delete options.context;
    delete options.selector;
    if (notify) {
        notify.setData(options);
        notify.show();
        return notify;
    }
    console.warn("未找到 van-notify 节点，请确认 selector 及 context 是否正确");
}
exports.default = Notify;
Notify.clear = function (options) {
    options = __assign(__assign({}, defaultOptions), parseOptions(options));
    const context = options.context || getContext();
    const notify = context.selectComponent(options.selector);
    if (notify) {
        notify.hide();
    }
};
Notify.setDefaultOptions = function (options) {
    Object.assign(currentOptions, options);
};
Notify.resetDefaultOptions = function () {
    currentOptions = __assign({}, defaultOptions);
};
