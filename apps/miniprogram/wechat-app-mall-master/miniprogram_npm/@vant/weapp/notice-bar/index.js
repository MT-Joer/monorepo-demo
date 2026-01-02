"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const utils_1 = require("../common/utils");

(0, component_1.VantComponent)({
    props: {
        text: {
            type: String,
            value: "",
            observer: "init",
        },
        mode: {
            type: String,
            value: "",
        },
        url: {
            type: String,
            value: "",
        },
        openType: {
            type: String,
            value: "navigate",
        },
        delay: {
            type: Number,
            value: 1,
        },
        speed: {
            type: Number,
            value: 60,
            observer: "init",
        },
        scrollable: null,
        leftIcon: {
            type: String,
            value: "",
        },
        color: String,
        backgroundColor: String,
        background: String,
        wrapable: Boolean,
    },
    data: {
        show: true,
    },
    created () {
        this.resetAnimation = wx.createAnimation({
            duration: 0,
            timingFunction: "linear",
        });
    },
    destroyed () {
        this.timer && clearTimeout(this.timer);
    },
    mounted () {
        this.init();
    },
    methods: {
        init () {
            const _this = this;
            (0, utils_1.requestAnimationFrame)(() => {
                Promise.all([
                    (0, utils_1.getRect)(_this, ".van-notice-bar__content"),
                    (0, utils_1.getRect)(_this, ".van-notice-bar__wrap"),
                ]).then((rects) => {
                    const contentRect = rects[0]; const wrapRect = rects[1];
                    const _a = _this.data; const speed = _a.speed; const scrollable = _a.scrollable; const delay = _a.delay;
                    if (contentRect == null ||
                        wrapRect == null ||
                        !contentRect.width ||
                        !wrapRect.width ||
                        scrollable === false) {
                        return;
                    }
                    if (scrollable || wrapRect.width < contentRect.width) {
                        const duration = ((wrapRect.width + contentRect.width) / speed) * 1000;
                        _this.wrapWidth = wrapRect.width;
                        _this.contentWidth = contentRect.width;
                        _this.duration = duration;
                        _this.animation = wx.createAnimation({
                            duration,
                            timingFunction: "linear",
                            delay,
                        });
                        _this.scroll(true);
                    }
                });
            });
        },
        scroll (isInit) {
            const _this = this;
            if (isInit === void 0) { isInit = false; }
            this.timer && clearTimeout(this.timer);
            this.timer = null;
            this.setData({
                animationData: this.resetAnimation
                    .translateX(isInit ? 0 : this.wrapWidth)
                    .step()
                    .export(),
            });
            (0, utils_1.requestAnimationFrame)(() => {
                _this.setData({
                    animationData: _this.animation
                        .translateX(-_this.contentWidth)
                        .step()
                        .export(),
                });
            });
            this.timer = setTimeout(() => {
                _this.scroll();
            }, this.duration + this.data.delay);
        },
        onClickIcon (event) {
            if (this.data.mode === "closeable") {
                this.timer && clearTimeout(this.timer);
                this.timer = null;
                this.setData({ show: false });
                this.$emit("close", event.detail);
            }
        },
        onClick (event) {
            this.$emit("click", event);
        },
    },
});
