"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.button = void 0;
const version_1 = require("../common/version");

exports.button = Behavior({
    externalClasses: [ "hover-class" ],
    properties: {
        id: String,
        buttonId: String,
        lang: String,
        businessId: Number,
        sessionFrom: String,
        sendMessageTitle: String,
        sendMessagePath: String,
        sendMessageImg: String,
        showMessageCard: Boolean,
        appParameter: String,
        ariaLabel: String,
        openType: String,
        getUserProfileDesc: String,
    },
    data: {
        canIUseGetUserProfile: (0, version_1.canIUseGetUserProfile)(),
    },
    methods: {
        onGetUserInfo (event) {
            this.triggerEvent("getuserinfo", event.detail);
        },
        onContact (event) {
            this.triggerEvent("contact", event.detail);
        },
        onGetPhoneNumber (event) {
            this.triggerEvent("getphonenumber", event.detail);
        },
        onGetRealTimePhoneNumber (event) {
            this.triggerEvent("getrealtimephonenumber", event.detail);
        },
        onError (event) {
            this.triggerEvent("error", event.detail);
        },
        onLaunchApp (event) {
            this.triggerEvent("launchapp", event.detail);
        },
        onOpenSetting (event) {
            this.triggerEvent("opensetting", event.detail);
        },
        onAgreePrivacyAuthorization (event) {
            this.triggerEvent("agreeprivacyauthorization", event.detail);
        },
        onChooseAvatar (event) {
            this.triggerEvent("chooseavatar", event.detail);
        },
    },
});
