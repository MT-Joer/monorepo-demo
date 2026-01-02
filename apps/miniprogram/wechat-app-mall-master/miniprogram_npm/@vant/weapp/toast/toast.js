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
const validator_1 = require("../common/validator");

const defaultOptions = {
    type: "text",
    mask: false,
    message: "",
    show: true,
    zIndex: 1000,
    duration: 2000,
    position: "middle",
    forbidClick: false,
    loadingType: "circular",
    selector: "#van-toast",
};
let queue = [];
let currentOptions = __assign({}, defaultOptions);
function parseOptions(message) {
    return (0, validator_1.isObj)(message) ? message : { message };
}
function getContext() {
    const pages = getCurrentPages();
    return pages[pages.length - 1];
}
function Toast(toastOptions) {
    const options = __assign(__assign({}, currentOptions), parseOptions(toastOptions));
    const context = (typeof options.context === "function"
        ? options.context()
        : options.context) || getContext();
    const toast = context.selectComponent(options.selector);
    if (!toast) {
        console.warn("未找到 van-toast 节点，请确认 selector 及 context 是否正确");
        return;
    }
    delete options.context;
    delete options.selector;
    toast.clear = function () {
        toast.setData({ show: false });
        if (options.onClose) {
            options.onClose();
        }
    };
    queue.push(toast);
    toast.setData(options);
    clearTimeout(toast.timer);
    if (options.duration != null && options.duration > 0) {
        toast.timer = setTimeout(() => {
            toast.clear();
            queue = queue.filter((item) => { return item !== toast; });
        }, options.duration);
    }
    return toast;
}
const createMethod = function (type) { return function (options) {
    return Toast(__assign({ type }, parseOptions(options)));
}; };
Toast.loading = createMethod("loading");
Toast.success = createMethod("success");
Toast.fail = createMethod("fail");
Toast.clear = function () {
    queue.forEach((toast) => {
        toast.clear();
    });
    queue = [];
};
Toast.setDefaultOptions = function (options) {
    Object.assign(currentOptions, options);
};
Toast.resetDefaultOptions = function () {
    currentOptions = __assign({}, defaultOptions);
};
exports.default = Toast;
