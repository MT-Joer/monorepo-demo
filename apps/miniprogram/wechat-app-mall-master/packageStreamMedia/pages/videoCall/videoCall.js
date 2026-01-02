const app = getApp();
const WXAPI = require("apifm-wxapi");

const AUTH = require("../../../utils/auth");

Page({
    data: {
        callingFlag: false,
        invitation: null,
        incomingCallFlag: false,
        inviteCallFlag: false,
        pusherAvatar: ""
    },

    call() {
        if (!this.data.uid) {
            wx.showToast({
                title: "请输入用户编号",
                icon: "none"
            });
            return;
        }
        if (this.data.config.userID === this.data.uid) {
            wx.showToast({
                title: "不可呼叫本机",
            });
            return;
        }
        this.data.config.type = 2;
        this.setData({
            callingFlag: true,
            inviteCallFlag: true,
            config: this.data.config,
        });
        this.TRTCCalling.call({ userID: this.data.uid, type: 2 });
    },

    bindTRTCCallingRoomEvent() {
        const TRTCCallingEvent = this.TRTCCalling.EVENT;
        this.TRTCCalling.on(TRTCCallingEvent.INVITED, (event) => {
            this.setData({
                invitation: event.data,
                incomingCallFlag: true,
            });
        });
        // 处理挂断的事件回调
        this.TRTCCalling.on(TRTCCallingEvent.HANG_UP, () => {
            this.setData({
                callingFlag: false,
            });
        });
        this.TRTCCalling.on(TRTCCallingEvent.REJECT, () => {
            this.setData({
                callingFlag: false,
                inviteCallFlag: false,
            });
            wx.showToast({
                title: "对方已拒绝",
            });
            this.TRTCCalling.hangup();
        });
        this.TRTCCalling.on(TRTCCallingEvent.USER_LEAVE, () => {
            this.TRTCCalling.hangup();
            wx.showToast({
                title: "对方已挂断",
            });
        });
        this.TRTCCalling.on(TRTCCallingEvent.NO_RESP, () => {
            this.setData({
                incomingCallFlag: false,
                inviteCallFlag: false,
            });
            wx.showToast({
                title: "无应答超时",
            });
            this.TRTCCalling.hangup();
        });
        this.TRTCCalling.on(TRTCCallingEvent.LINE_BUSY, () => {
            this.setData({
                incomingCallFlag: false,
                inviteCallFlag: false,
            });
            wx.showToast({
                title: "对方忙线中",
            });
            this.TRTCCalling.hangup();
        });
        this.TRTCCalling.on(TRTCCallingEvent.CALLING_CANCEL, () => {
            this.setData({
                incomingCallFlag: false,
            });
            wx.showToast({
                title: "通话已取消",
            });
        });
        this.TRTCCalling.on(TRTCCallingEvent.USER_ENTER, () => {
            this.setData({
                inviteCallFlag: false,
            });
        });
    },

    handleOnAccept() {
        this.data.config.type = this.data.invitation.type;
        this.setData({
            callingFlag: true,
            incomingCallFlag: false,
            config: this.data.config,
        }, () => {
            this.TRTCCalling.accept();
        });
    },

    handleOnReject() {
        this.setData({
            incomingCallFlag: false,
        }, () => {
            this.TRTCCalling.reject();
        });
    },

    handleOnCancel() {
        this.TRTCCalling.hangup();
        this.setData({
            inviteCallFlag: false,
        });
    },

    onBack() {
        wx.navigateBack({
            delta: 1,
        });
        this.TRTCCalling.logout();
    },

    onLoad() {
        this.initTrtc();
    },

    onShow() {
        AUTH.checkHasLogined().then(isLogined => {
            this.data.isLogined = isLogined;
            if (!isLogined) {
                AUTH.login(this);
            }
        });
    },
    async initTrtc () {
        const res = await WXAPI.trtcUserSig(wx.getStorageSync("token"));
        if (res.code === 0) {
            app.globalData.sdkAppID = res.data.sDKAppID;
            this.data.config = {
                sdkAppID: res.data.sDKAppID,
                userID: `${res.data.userID  }`,
                userSig: res.data.userSig,
                type: 2
            };
            this.setData({
                config: this.data.config,
                loaclPhoneNumber: res.data.userID,
                pusherAvatar: this.data.pusherAvatar,
            }, () => {
                this.TRTCCalling = this.selectComponent("#TRTCCalling-component");
                this.bindTRTCCallingRoomEvent();
                this.TRTCCalling.login();
            });
        }
    },
});
