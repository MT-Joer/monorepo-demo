"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const utils_1 = require("../common/utils");
const touch_1 = require("../mixins/touch");

const THRESHOLD = 0.3;
let ARRAY = [];
(0, component_1.VantComponent)({
    props: {
        disabled: Boolean,
        leftWidth: {
            type: Number,
            value: 0,
            observer (leftWidth) {
                if (leftWidth === void 0) { leftWidth = 0; }
                if (this.offset > 0) {
                    this.swipeMove(leftWidth);
                }
            },
        },
        rightWidth: {
            type: Number,
            value: 0,
            observer (rightWidth) {
                if (rightWidth === void 0) { rightWidth = 0; }
                if (this.offset < 0) {
                    this.swipeMove(-rightWidth);
                }
            },
        },
        asyncClose: Boolean,
        name: {
            type: null,
            value: "",
        },
    },
    mixins: [ touch_1.touch ],
    data: {
        catchMove: false,
        wrapperStyle: "",
    },
    created () {
        this.offset = 0;
        ARRAY.push(this);
    },
    destroyed () {
        const _this = this;
        ARRAY = ARRAY.filter((item) => { return item !== _this; });
    },
    methods: {
        open (position) {
            const _a = this.data; const leftWidth = _a.leftWidth; const rightWidth = _a.rightWidth;
            const offset = position === "left" ? leftWidth : -rightWidth;
            this.swipeMove(offset);
            this.$emit("open", {
                position,
                name: this.data.name,
            });
        },
        close () {
            this.swipeMove(0);
        },
        swipeMove (offset) {
            if (offset === void 0) { offset = 0; }
            this.offset = (0, utils_1.range)(offset, -this.data.rightWidth, this.data.leftWidth);
            const transform = "translate3d(".concat(this.offset, "px, 0, 0)");
            const transition = this.dragging
                ? "none"
                : "transform .6s cubic-bezier(0.18, 0.89, 0.32, 1)";
            this.setData({
                wrapperStyle: "\n        -webkit-transform: ".concat(transform, ";\n        -webkit-transition: ").concat(transition, ";\n        transform: ").concat(transform, ";\n        transition: ").concat(transition, ";\n      "),
            });
        },
        swipeLeaveTransition () {
            const _a = this.data; const leftWidth = _a.leftWidth; const rightWidth = _a.rightWidth;
            const offset = this.offset;
            if (rightWidth > 0 && -offset > rightWidth * THRESHOLD) {
                this.open("right");
            }
            else if (leftWidth > 0 && offset > leftWidth * THRESHOLD) {
                this.open("left");
            }
            else {
                this.swipeMove(0);
            }
            this.setData({ catchMove: false });
        },
        startDrag (event) {
            if (this.data.disabled) {
                return;
            }
            this.startOffset = this.offset;
            this.touchStart(event);
        },
        noop () {},
        onDrag (event) {
            const _this = this;
            if (this.data.disabled) {
                return;
            }
            this.touchMove(event);
            if (this.direction !== "horizontal") {
                return;
            }
            this.dragging = true;
            ARRAY.filter((item) => { return item !== _this && item.offset !== 0; }).forEach((item) => { return item.close(); });
            this.setData({ catchMove: true });
            this.swipeMove(this.startOffset + this.deltaX);
        },
        endDrag () {
            if (this.data.disabled) {
                return;
            }
            this.dragging = false;
            this.swipeLeaveTransition();
        },
        onClick (event) {
            const _a = event.currentTarget.dataset.key; const position = _a === void 0 ? "outside" : _a;
            this.$emit("click", position);
            if (!this.offset) {
                return;
            }
            if (this.data.asyncClose) {
                this.$emit("close", {
                    position,
                    instance: this,
                    name: this.data.name,
                });
            }
            else {
                this.swipeMove(0);
            }
        },
    },
});
