"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const relation_1 = require("../common/relation");

(0, component_1.VantComponent)({
    classes: [ "item-title-class" ],
    field: true,
    relation: (0, relation_1.useParent)("dropdown-menu", function () {
        this.updateDataFromParent();
    }),
    props: {
        value: {
            type: null,
            observer: "rerender",
        },
        title: {
            type: String,
            observer: "rerender",
        },
        disabled: Boolean,
        titleClass: {
            type: String,
            observer: "rerender",
        },
        options: {
            type: Array,
            value: [],
            observer: "rerender",
        },
        popupStyle: String,
        useBeforeToggle: {
            type: Boolean,
            value: false,
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    data: {
        transition: true,
        showPopup: false,
        showWrapper: false,
        displayTitle: "",
        safeAreaTabBar: false,
    },
    methods: {
        rerender () {
            const _this = this;
            wx.nextTick(() => {
                let _a;
                (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.updateItemListData();
            });
        },
        updateDataFromParent () {
            if (this.parent) {
                const _a = this.parent.data; const overlay = _a.overlay; const duration = _a.duration; const activeColor = _a.activeColor; const closeOnClickOverlay = _a.closeOnClickOverlay; const direction = _a.direction; const safeAreaTabBar = _a.safeAreaTabBar;
                this.setData({
                    overlay,
                    duration,
                    activeColor,
                    closeOnClickOverlay,
                    direction,
                    safeAreaTabBar,
                });
            }
        },
        onOpen () {
            this.$emit("open");
        },
        onOpened () {
            this.$emit("opened");
        },
        onClose () {
            this.$emit("close");
        },
        onClosed () {
            this.$emit("closed");
            this.setData({ showWrapper: false });
        },
        onOptionTap (event) {
            const option = event.currentTarget.dataset.option;
            const value = option.value;
            const shouldEmitChange = this.data.value !== value;
            this.setData({ showPopup: false, value });
            this.$emit("close");
            this.rerender();
            if (shouldEmitChange) {
                this.$emit("change", value);
            }
        },
        toggle (show, options) {
            const _this = this;
            if (options === void 0) { options = {}; }
            const showPopup = this.data.showPopup;
            if (typeof show !== "boolean") {
                show = !showPopup;
            }
            if (show === showPopup) {
                return;
            }
            this.onBeforeToggle(show).then((status) => {
                let _a;
                if (!status) {
                    return;
                }
                _this.setData({
                    transition: !options.immediate,
                    showPopup: show,
                });
                if (show) {
                    (_a = _this.parent) === null || _a === void 0 ? void 0 : _a.getChildWrapperStyle().then((wrapperStyle) => {
                        _this.setData({ wrapperStyle, showWrapper: true });
                        _this.rerender();
                    });
                }
                else {
                    _this.rerender();
                }
            });
        },
        onBeforeToggle (status) {
            const _this = this;
            const useBeforeToggle = this.data.useBeforeToggle;
            if (!useBeforeToggle) {
                return Promise.resolve(true);
            }
            return new Promise((resolve) => {
                _this.$emit("before-toggle", {
                    status,
                    callback (value) { return resolve(value); },
                });
            });
        },
    },
});
