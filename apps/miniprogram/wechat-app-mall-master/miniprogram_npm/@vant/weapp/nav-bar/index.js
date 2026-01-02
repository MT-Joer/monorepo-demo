"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const utils_1 = require("../common/utils");

(0, component_1.VantComponent)({
    classes: [ "title-class" ],
    props: {
        title: String,
        fixed: {
            type: Boolean,
            observer: "setHeight",
        },
        placeholder: {
            type: Boolean,
            observer: "setHeight",
        },
        leftText: String,
        rightText: String,
        customStyle: String,
        leftArrow: Boolean,
        border: {
            type: Boolean,
            value: true,
        },
        zIndex: {
            type: Number,
            value: 1,
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        height: 46,
    },
    created () {
        const statusBarHeight = (0, utils_1.getSystemInfoSync)().statusBarHeight;
        this.setData({
            statusBarHeight,
            height: 46 + statusBarHeight,
        });
    },
    mounted () {
        this.setHeight();
    },
    methods: {
        onClickLeft () {
            this.$emit("click-left");
        },
        onClickRight () {
            this.$emit("click-right");
        },
        setHeight () {
            const _this = this;
            if (!this.data.fixed || !this.data.placeholder) {
                return;
            }
            wx.nextTick(() => {
                (0, utils_1.getRect)(_this, ".van-nav-bar").then((res) => {
                    if (res && "height" in res) {
                        _this.setData({ height: res.height });
                    }
                });
            });
        },
    },
});
