"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const transition_1 = require("../mixins/transition");

(0, component_1.VantComponent)({
    classes: [
        "enter-class",
        "enter-active-class",
        "enter-to-class",
        "leave-class",
        "leave-active-class",
        "leave-to-class",
        "close-icon-class",
    ],
    mixins: [ (0, transition_1.transition)(false) ],
    props: {
        round: Boolean,
        closeable: Boolean,
        customStyle: String,
        overlayStyle: String,
        transition: {
            type: String,
            observer: "observeClass",
        },
        zIndex: {
            type: Number,
            value: 100,
        },
        overlay: {
            type: Boolean,
            value: true,
        },
        closeIcon: {
            type: String,
            value: "cross",
        },
        closeIconPosition: {
            type: String,
            value: "top-right",
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true,
        },
        position: {
            type: String,
            value: "center",
            observer: "observeClass",
        },
        safeAreaInsetBottom: {
            type: Boolean,
            value: true,
        },
        safeAreaInsetTop: {
            type: Boolean,
            value: false,
        },
        safeAreaTabBar: {
            type: Boolean,
            value: false,
        },
        lockScroll: {
            type: Boolean,
            value: true,
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    created () {
        this.observeClass();
    },
    methods: {
        onClickCloseIcon () {
            this.$emit("close");
        },
        onClickOverlay () {
            this.$emit("click-overlay");
            if (this.data.closeOnClickOverlay) {
                this.$emit("close");
            }
        },
        observeClass () {
            const _a = this.data; const transition = _a.transition; const position = _a.position; const duration = _a.duration;
            const updateData = {
                name: transition || position,
            };
            if (transition === "none") {
                updateData.duration = 0;
                this.originDuration = duration;
            }
            else if (this.originDuration != null) {
                updateData.duration = this.originDuration;
            }
            this.setData(updateData);
        },
    },
});
