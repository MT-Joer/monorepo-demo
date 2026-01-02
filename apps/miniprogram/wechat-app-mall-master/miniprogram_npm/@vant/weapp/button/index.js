"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../common/component");
const version_1 = require("../common/version");
const button_1 = require("../mixins/button");

const mixins = [ button_1.button ];
if ((0, version_1.canIUseFormFieldButton)()) {
    mixins.push("wx://form-field-button");
}
(0, component_1.VantComponent)({
    mixins,
    classes: [ "hover-class", "loading-class" ],
    data: {
        baseStyle: "",
    },
    props: {
        formType: String,
        icon: String,
        classPrefix: {
            type: String,
            value: "van-icon",
        },
        plain: Boolean,
        block: Boolean,
        round: Boolean,
        square: Boolean,
        loading: Boolean,
        hairline: Boolean,
        disabled: Boolean,
        loadingText: String,
        customStyle: String,
        loadingType: {
            type: String,
            value: "circular",
        },
        type: {
            type: String,
            value: "default",
        },
        dataset: null,
        size: {
            type: String,
            value: "normal",
        },
        loadingSize: {
            type: String,
            value: "20px",
        },
        color: String,
    },
    methods: {
        onClick (event) {
            const _this = this;
            this.$emit("click", event);
            const _a = this.data; const canIUseGetUserProfile = _a.canIUseGetUserProfile; const openType = _a.openType; const getUserProfileDesc = _a.getUserProfileDesc; const lang = _a.lang;
            if (openType === "getUserInfo" && canIUseGetUserProfile) {
                wx.getUserProfile({
                    desc: getUserProfileDesc || "  ",
                    lang: lang || "en",
                    complete (userProfile) {
                        _this.$emit("getuserinfo", userProfile);
                    },
                });
            }
        },
    },
});
