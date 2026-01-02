"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const color_1 = require("../common/color");
const component_1 = require("../common/component");
const utils_1 = require("../common/utils");
const validator_1 = require("../common/validator");
const version_1 = require("../common/version");
const canvas_1 = require("./canvas");

function format(rate) {
    return Math.min(Math.max(rate, 0), 100);
}
const PERIMETER = 2 * Math.PI;
const BEGIN_ANGLE = -Math.PI / 2;
const STEP = 1;
(0, component_1.VantComponent)({
    props: {
        text: String,
        lineCap: {
            type: String,
            value: "round",
        },
        value: {
            type: Number,
            value: 0,
            observer: "reRender",
        },
        speed: {
            type: Number,
            value: 50,
        },
        size: {
            type: Number,
            value: 100,
            observer () {
                this.drawCircle(this.currentValue);
            },
        },
        fill: String,
        layerColor: {
            type: String,
            value: color_1.WHITE,
        },
        color: {
            type: null,
            value: color_1.BLUE,
            observer () {
                const _this = this;
                this.setHoverColor().then(() => {
                    _this.drawCircle(_this.currentValue);
                });
            },
        },
        type: {
            type: String,
            value: "",
        },
        strokeWidth: {
            type: Number,
            value: 4,
        },
        clockwise: {
            type: Boolean,
            value: true,
        },
    },
    data: {
        hoverColor: color_1.BLUE,
    },
    methods: {
        getContext () {
            const _this = this;
            const _a = this.data; const type = _a.type; const size = _a.size;
            if (type === "" || !(0, version_1.canIUseCanvas2d)()) {
                const ctx = wx.createCanvasContext("van-circle", this);
                return Promise.resolve(ctx);
            }
            const dpr = (0, utils_1.getSystemInfoSync)().pixelRatio;
            return new Promise((resolve) => {
                wx.createSelectorQuery()
                    .in(_this)
                    .select("#van-circle")
                    .node()
                    .exec((res) => {
                        const canvas = res[0].node;
                        const ctx = canvas.getContext(type);
                        if (!_this.inited) {
                            _this.inited = true;
                            canvas.width = size * dpr;
                            canvas.height = size * dpr;
                            ctx.scale(dpr, dpr);
                        }
                        resolve((0, canvas_1.adaptor)(ctx));
                    });
            });
        },
        setHoverColor () {
            const _this = this;
            const _a = this.data; const color = _a.color; const size = _a.size;
            if ((0, validator_1.isObj)(color)) {
                return this.getContext().then((context) => {
                    if (!context)
                        return;
                    const LinearColor = context.createLinearGradient(size, 0, 0, 0);
                    Object.keys(color)
                        .sort((a, b) => { return Number.parseFloat(a) - Number.parseFloat(b); })
                        .map((key) => {
                            return LinearColor.addColorStop(Number.parseFloat(key) / 100, color[key]);
                        });
                    _this.hoverColor = LinearColor;
                });
            }
            this.hoverColor = color;
            return Promise.resolve();
        },
        presetCanvas (context, strokeStyle, beginAngle, endAngle, fill) {
            const _a = this.data; const strokeWidth = _a.strokeWidth; const lineCap = _a.lineCap; const clockwise = _a.clockwise; const size = _a.size;
            const position = size / 2;
            const radius = position - strokeWidth / 2;
            context.setStrokeStyle(strokeStyle);
            context.setLineWidth(strokeWidth);
            context.setLineCap(lineCap);
            context.beginPath();
            context.arc(position, position, radius, beginAngle, endAngle, !clockwise);
            context.stroke();
            if (fill) {
                context.setFillStyle(fill);
                context.fill();
            }
        },
        renderLayerCircle (context) {
            const _a = this.data; const layerColor = _a.layerColor; const fill = _a.fill;
            this.presetCanvas(context, layerColor, 0, PERIMETER, fill);
        },
        renderHoverCircle (context, formatValue) {
            const clockwise = this.data.clockwise;
            // 结束角度
            const progress = PERIMETER * (formatValue / 100);
            const endAngle = clockwise
                ? BEGIN_ANGLE + progress
                : 3 * Math.PI - (BEGIN_ANGLE + progress);
            this.presetCanvas(context, this.hoverColor, BEGIN_ANGLE, endAngle);
        },
        drawCircle (currentValue) {
            const _this = this;
            const size = this.data.size;
            this.getContext().then((context) => {
                if (!context)
                    return;
                context.clearRect(0, 0, size, size);
                _this.renderLayerCircle(context);
                const formatValue = format(currentValue);
                if (formatValue !== 0) {
                    _this.renderHoverCircle(context, formatValue);
                }
                context.draw();
            });
        },
        reRender () {
            const _this = this;
            // tofector 动画暂时没有想到好的解决方案
            const _a = this.data; const value = _a.value; const speed = _a.speed;
            if (speed <= 0 || speed > 1000) {
                this.drawCircle(value);
                return;
            }
            this.clearMockInterval();
            this.currentValue = this.currentValue || 0;
            const run = function () {
                _this.interval = setTimeout(() => {
                    if (_this.currentValue === value) {
                        _this.clearMockInterval();
                    }
                    else {
                        if (Math.abs(_this.currentValue - value) < STEP) {
                            _this.currentValue = value;
                        }
                        else if (_this.currentValue < value) {
                            _this.currentValue += STEP;
                        }
                        else {
                            _this.currentValue -= STEP;
                        }
                        _this.drawCircle(_this.currentValue);
                        run();
                    }
                }, 1000 / speed);
            };
            run();
        },
        clearMockInterval () {
            if (this.interval) {
                clearTimeout(this.interval);
                this.interval = null;
            }
        },
    },
    mounted () {
        const _this = this;
        this.currentValue = this.data.value;
        this.setHoverColor().then(() => {
            _this.drawCircle(_this.currentValue);
        });
    },
    destroyed () {
        this.clearMockInterval();
    },
});
