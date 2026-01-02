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
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");
const utils_1 = require("../common/utils");
const validator_1 = require("../common/validator");
const touch_1 = require("../mixins/touch");

(0, component_1.VantComponent)({
    mixins: [ touch_1.touch ],
    classes: [
        "nav-class",
        "tab-class",
        "tab-active-class",
        "line-class",
        "wrap-class",
    ],
    relation: (0, relation_1.useChildren)("tab", function () {
        this.updateTabs();
    }),
    props: {
        sticky: Boolean,
        border: Boolean,
        swipeable: Boolean,
        titleActiveColor: String,
        titleInactiveColor: String,
        color: String,
        animated: {
            type: Boolean,
            observer () {
                const _this = this;
                this.children.forEach((child, index) => {
                    return child.updateRender(index === _this.data.currentIndex, _this);
                });
            },
        },
        lineWidth: {
            type: null,
            value: 40,
            observer: "resize",
        },
        lineHeight: {
            type: null,
            value: -1,
        },
        active: {
            type: null,
            value: 0,
            observer (name) {
                if (name !== this.getCurrentName()) {
                    this.setCurrentIndexByName(name);
                }
            },
        },
        type: {
            type: String,
            value: "line",
        },
        ellipsis: {
            type: Boolean,
            value: true,
        },
        duration: {
            type: Number,
            value: 0.3,
        },
        zIndex: {
            type: Number,
            value: 1,
        },
        swipeThreshold: {
            type: Number,
            value: 5,
            observer (value) {
                this.setData({
                    scrollable: this.children.length > value || !this.data.ellipsis,
                });
            },
        },
        offsetTop: {
            type: Number,
            value: 0,
        },
        lazyRender: {
            type: Boolean,
            value: true,
        },
        useBeforeChange: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        tabs: [],
        scrollLeft: 0,
        scrollable: false,
        currentIndex: 0,
        container: null,
        skipTransition: true,
        scrollWithAnimation: false,
        lineOffsetLeft: 0,
        inited: false,
    },
    mounted () {
        const _this = this;
        (0, utils_1.requestAnimationFrame)(() => {
            _this.swiping = true;
            _this.setData({
                container () { return _this.createSelectorQuery().select(".van-tabs"); },
            });
            _this.resize();
            _this.scrollIntoView();
        });
    },
    methods: {
        updateTabs () {
            const _a = this; const _b = _a.children; const children = _b === void 0 ? [] : _b; const data = _a.data;
            this.setData({
                tabs: children.map((child) => { return child.data; }),
                scrollable: this.children.length > data.swipeThreshold || !data.ellipsis,
            });
            this.setCurrentIndexByName(data.active || this.getCurrentName());
        },
        trigger (eventName, child) {
            const currentIndex = this.data.currentIndex;
            const data = this.getChildData(currentIndex, child);
            if (!(0, validator_1.isDef)(data)) {
                return;
            }
            this.$emit(eventName, data);
        },
        onTap (event) {
            const _this = this;
            const index = event.currentTarget.dataset.index;
            const child = this.children[index];
            if (child.data.disabled) {
                this.trigger("disabled", child);
                return;
            }
            this.onBeforeChange(index).then(() => {
                _this.setCurrentIndex(index);
                (0, utils_1.nextTick)(() => {
                    _this.trigger("click");
                });
            });
        },
        // correct the index of active tab
        setCurrentIndexByName (name) {
            const _a = this.children; const children = _a === void 0 ? [] : _a;
            const matched = children.filter((child) => { return child.getComputedName() === name; });
            if (matched.length > 0) {
                this.setCurrentIndex(matched[0].index);
            }
        },
        setCurrentIndex (currentIndex) {
            const _this = this;
            const _a = this; const data = _a.data; const _b = _a.children; const children = _b === void 0 ? [] : _b;
            if (!(0, validator_1.isDef)(currentIndex) ||
                currentIndex >= children.length ||
                currentIndex < 0) {
                return;
            }
            (0, utils_1.groupSetData)(this, () => {
                children.forEach((item, index) => {
                    const active = index === currentIndex;
                    if (active !== item.data.active || !item.inited) {
                        item.updateRender(active, _this);
                    }
                });
            });
            if (currentIndex === data.currentIndex) {
                if (!data.inited) {
                    this.resize();
                }
                return;
            }
            const shouldEmitChange = data.currentIndex !== null;
            this.setData({ currentIndex });
            (0, utils_1.requestAnimationFrame)(() => {
                _this.resize();
                _this.scrollIntoView();
            });
            (0, utils_1.nextTick)(() => {
                _this.trigger("input");
                if (shouldEmitChange) {
                    _this.trigger("change");
                }
            });
        },
        getCurrentName () {
            const activeTab = this.children[this.data.currentIndex];
            if (activeTab) {
                return activeTab.getComputedName();
            }
        },
        resize () {
            const _this = this;
            if (this.data.type !== "line") {
                return;
            }
            const _a = this.data; const currentIndex = _a.currentIndex; const ellipsis = _a.ellipsis; const skipTransition = _a.skipTransition;
            Promise.all([
                (0, utils_1.getAllRect)(this, ".van-tab"),
                (0, utils_1.getRect)(this, ".van-tabs__line"),
            ]).then((_a) => {
                const _b = _a[0]; const rects = _b === void 0 ? [] : _b; const lineRect = _a[1];
                const rect = rects[currentIndex];
                if (rect == null) {
                    return;
                }
                let lineOffsetLeft = rects
                    .slice(0, currentIndex)
                    .reduce((prev, curr) => { return prev + curr.width; }, 0);
                lineOffsetLeft +=
                    (rect.width - lineRect.width) / 2 + (ellipsis ? 0 : 8);
                _this.setData({ lineOffsetLeft, inited: true });
                _this.swiping = true;
                if (skipTransition) {
                    // waiting transition end
                    setTimeout(() => {
                        _this.setData({ skipTransition: false });
                    }, _this.data.duration);
                }
            });
        },
        // scroll active tab into view
        scrollIntoView () {
            const _this = this;
            const _a = this.data; const currentIndex = _a.currentIndex; const scrollable = _a.scrollable; const scrollWithAnimation = _a.scrollWithAnimation;
            if (!scrollable) {
                return;
            }
            Promise.all([
                (0, utils_1.getAllRect)(this, ".van-tab"),
                (0, utils_1.getRect)(this, ".van-tabs__nav"),
            ]).then((_a) => {
                const navRect = _a[1]; const tabRects = _a[0];
                const tabRect = tabRects[currentIndex];
                const offsetLeft = tabRects
                    .slice(0, currentIndex)
                    .reduce((prev, curr) => { return prev + curr.width; }, 0);
                _this.setData({
                    scrollLeft: offsetLeft - (navRect.width - tabRect.width) / 2,
                });
                if (!scrollWithAnimation) {
                    (0, utils_1.nextTick)(() => {
                        _this.setData({ scrollWithAnimation: true });
                    });
                }
            });
        },
        onTouchScroll (event) {
            this.$emit("scroll", event.detail);
        },
        onTouchStart (event) {
            if (!this.data.swipeable)
                return;
            this.swiping = true;
            this.touchStart(event);
        },
        onTouchMove (event) {
            if (!this.data.swipeable || !this.swiping)
                return;
            this.touchMove(event);
        },
        // watch swipe touch end
        onTouchEnd () {
            const _this = this;
            if (!this.data.swipeable || !this.swiping)
                return;
            const _a = this; const direction = _a.direction; const deltaX = _a.deltaX; const offsetX = _a.offsetX;
            const minSwipeDistance = 50;
            if (direction === "horizontal" && offsetX >= minSwipeDistance) {
                const index_1 = this.getAvaiableTab(deltaX);
                if (index_1 !== -1) {
                    this.onBeforeChange(index_1).then(() => { return _this.setCurrentIndex(index_1); });
                }
            }
            this.swiping = false;
        },
        getAvaiableTab (direction) {
            const _a = this.data; const tabs = _a.tabs; const currentIndex = _a.currentIndex;
            const step = direction > 0 ? -1 : 1;
            for (let i = step; currentIndex + i < tabs.length && currentIndex + i >= 0; i += step) {
                const index = currentIndex + i;
                if (index >= 0 &&
                    index < tabs.length &&
                    tabs[index] &&
                    !tabs[index].disabled) {
                    return index;
                }
            }
            return -1;
        },
        onBeforeChange (index) {
            const _this = this;
            const useBeforeChange = this.data.useBeforeChange;
            if (!useBeforeChange) {
                return Promise.resolve();
            }
            return new Promise((resolve, reject) => {
                _this.$emit("before-change", __assign(__assign({}, _this.getChildData(index)), { callback (status) { return (status ? resolve() : reject()); } }));
            });
        },
        getChildData (index, child) {
            const currentChild = child || this.children[index];
            if (!(0, validator_1.isDef)(currentChild)) {
                return;
            }
            return {
                index: currentChild.index,
                name: currentChild.getComputedName(),
                title: currentChild.data.title,
            };
        },
    },
});
