"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("../common/color");
const component_1 = require("../common/component");
const utils_1 = require("../common/utils");
const button_1 = require("../mixins/button");

(0, component_1.VantComponent)({
    mixins: [ button_1.button ],
    classes: [ "cancle-button-class", "confirm-button-class" ],
    props: {
        show: {
            type: Boolean,
            observer (show) {
                !show && this.stopLoading();
            },
        },
        title: String,
        message: String,
        theme: {
            type: String,
            value: "default",
        },
        confirmButtonId: String,
        className: String,
        customStyle: String,
        asyncClose: Boolean,
        messageAlign: String,
        beforeClose: null,
        overlayStyle: String,
        useSlot: Boolean,
        useTitleSlot: Boolean,
        useConfirmButtonSlot: Boolean,
        useCancelButtonSlot: Boolean,
        showCancelButton: Boolean,
        closeOnClickOverlay: Boolean,
        confirmButtonOpenType: String,
        width: null,
        zIndex: {
            type: Number,
            value: 2000,
        },
        confirmButtonText: {
            type: String,
            value: "确认",
        },
        cancelButtonText: {
            type: String,
            value: "取消",
        },
        confirmButtonColor: {
            type: String,
            value: color_1.RED,
        },
        cancelButtonColor: {
            type: String,
            value: color_1.GRAY,
        },
        showConfirmButton: {
            type: Boolean,
            value: true,
        },
        overlay: {
            type: Boolean,
            value: true,
        },
        transition: {
            type: String,
            value: "scale",
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        loading: {
            confirm: false,
            cancel: false,
        },
        callback () {},
    },
    methods: {
        onConfirm () {
            this.handleAction("confirm");
        },
        onCancel () {
            this.handleAction("cancel");
        },
        onClickOverlay () {
            this.close("overlay");
        },
        close (action) {
            const _this = this;
            this.setData({ show: false });
            wx.nextTick(() => {
                _this.$emit("close", action);
                const callback = _this.data.callback;
                if (callback) {
                    callback(action, _this);
                }
            });
        },
        stopLoading () {
            this.setData({
                loading: {
                    confirm: false,
                    cancel: false,
                },
            });
        },
        handleAction (action) {
            let _a;
            const _this = this;
            this.$emit(action, { dialog: this });
            const _b = this.data; const asyncClose = _b.asyncClose; const beforeClose = _b.beforeClose;
            if (!asyncClose && !beforeClose) {
                this.close(action);
                return;
            }
            this.setData((_a = {},
            _a["loading.".concat(action)] = true,
            _a));
            if (beforeClose) {
                (0, utils_1.toPromise)(beforeClose(action)).then((value) => {
                    if (value) {
                        _this.close(action);
                    }
                    else {
                        _this.stopLoading();
                    }
                });
            }
        },
    },
});
