"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const button_1 = require("../mixins/button");

(0, component_1.VantComponent)({
    classes: [ "list-class" ],
    mixins: [ button_1.button ],
    props: {
        show: Boolean,
        title: String,
        cancelText: String,
        description: String,
        round: {
            type: Boolean,
            value: true,
        },
        zIndex: {
            type: Number,
            value: 100,
        },
        actions: {
            type: Array,
            value: [],
        },
        overlay: {
            type: Boolean,
            value: true,
        },
        closeOnClickOverlay: {
            type: Boolean,
            value: true,
        },
        closeOnClickAction: {
            type: Boolean,
            value: true,
        },
        safeAreaInsetBottom: {
            type: Boolean,
            value: true,
        },
        rootPortal: {
            type: Boolean,
            value: false,
        },
    },
    methods: {
        onSelect (event) {
            const _this = this;
            const index = event.currentTarget.dataset.index;
            const _a = this.data; const actions = _a.actions; const closeOnClickAction = _a.closeOnClickAction; const canIUseGetUserProfile = _a.canIUseGetUserProfile;
            const item = actions[index];
            if (item) {
                this.$emit("select", item);
                if (closeOnClickAction) {
                    this.onClose();
                }
                if (item.openType === "getUserInfo" && canIUseGetUserProfile) {
                    wx.getUserProfile({
                        desc: item.getUserProfileDesc || "  ",
                        complete (userProfile) {
                            _this.$emit("getuserinfo", userProfile);
                        },
                    });
                }
            }
        },
        onCancel () {
            this.$emit("cancel");
        },
        onClose () {
            this.$emit("close");
        },
        onClickOverlay () {
            this.$emit("click-overlay");
            this.onClose();
        },
    },
});
