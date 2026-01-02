"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const utils_1 = require("../common/utils");
const validator_1 = require("../common/validator");
const page_scroll_1 = require("../mixins/page-scroll");

const ROOT_ELEMENT = ".van-sticky";
(0, component_1.VantComponent)({
    props: {
        zIndex: {
            type: Number,
            value: 99,
        },
        offsetTop: {
            type: Number,
            value: 0,
            observer: "onScroll",
        },
        disabled: {
            type: Boolean,
            observer: "onScroll",
        },
        container: {
            type: null,
            observer: "onScroll",
        },
        scrollTop: {
            type: null,
            observer (val) {
                this.onScroll({ scrollTop: val });
            },
        },
    },
    mixins: [
        (0, page_scroll_1.pageScrollMixin)(function (event) {
            if (this.data.scrollTop != null) {
                return;
            }
            this.onScroll(event);
        }),
    ],
    data: {
        height: 0,
        fixed: false,
        transform: 0,
    },
    mounted () {
        this.onScroll();
    },
    methods: {
        onScroll (_a) {
            const _this = this;
            const _b = _a === void 0 ? {} : _a; const scrollTop = _b.scrollTop;
            const _c = this.data; const container = _c.container; const offsetTop = _c.offsetTop; const disabled = _c.disabled;
            if (disabled) {
                this.setDataAfterDiff({
                    fixed: false,
                    transform: 0,
                });
                return;
            }
            this.scrollTop = scrollTop || this.scrollTop;
            if (typeof container === "function") {
                Promise.all([ (0, utils_1.getRect)(this, ROOT_ELEMENT), this.getContainerRect() ])
                    .then((_a) => {
                        const container = _a[1]; const root = _a[0];
                        if (offsetTop + root.height > container.height + container.top) {
                            _this.setDataAfterDiff({
                                fixed: false,
                                transform: container.height - root.height,
                            });
                        }
                        else if (offsetTop >= root.top) {
                            _this.setDataAfterDiff({
                                fixed: true,
                                height: root.height,
                                transform: 0,
                            });
                        }
                        else {
                            _this.setDataAfterDiff({ fixed: false, transform: 0 });
                        }
                    })
                    .catch(() => {});
                return;
            }
            (0, utils_1.getRect)(this, ROOT_ELEMENT).then((root) => {
                if (!(0, validator_1.isDef)(root) || (!root.width && !root.height)) {
                    return;
                }
                if (offsetTop >= root.top) {
                    _this.setDataAfterDiff({ fixed: true, height: root.height });
                    _this.transform = 0;
                }
                else {
                    _this.setDataAfterDiff({ fixed: false });
                }
            });
        },
        setDataAfterDiff (data) {
            const _this = this;
            wx.nextTick(() => {
                const diff = Object.keys(data).reduce((prev, key) => {
                    if (data[key] !== _this.data[key]) {
                        prev[key] = data[key];
                    }
                    return prev;
                }, {});
                if (Object.keys(diff).length > 0) {
                    _this.setData(diff);
                }
                _this.$emit("scroll", {
                    scrollTop: _this.scrollTop,
                    isFixed: data.fixed || _this.data.fixed,
                });
            });
        },
        getContainerRect () {
            const nodesRef = this.data.container();
            if (!nodesRef) {
                return Promise.reject(new Error("not found container"));
            }
            return new Promise((resolve) => { return nodesRef.boundingClientRect(resolve).exec(); });
        },
    },
});
