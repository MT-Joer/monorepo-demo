const WXAPI = require("apifm-wxapi");

const AUTH = require("../../utils/auth");

const app = getApp();
Page({
    data: {
        addressList: []
    },

    selectTap(e) {
        const id = e.currentTarget.dataset.id;
        WXAPI.updateAddress({
            token: wx.getStorageSync("token"),
            id,
            isDefault: "true"
        }).then((res) => {
            wx.navigateBack({});
        });
    },

    addAddess() {
        wx.navigateTo({
            url: "/pages/address-add/index"
        });
    },

    editAddess(e) {
        wx.navigateTo({
            url: `/pages/address-add/index?id=${  e.currentTarget.dataset.id}`
        });
    },

    onLoad() {},
    onShow() {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.initShippingAddress();
            } else {
                wx.showModal({
                    title: "提示",
                    content: "本次操作需要您的登录授权",
                    cancelText: "暂不登录",
                    confirmText: "前往登录",
                    success(res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: "/pages/user/index"
                            });
                        } else {
                            wx.navigateBack();
                        }
                    }
                });
            }
        });
    },
    initShippingAddress() {
        const that = this;
        WXAPI.queryAddress(wx.getStorageSync("token")).then((res) => {
            console.log(res, "<-resDa->");
            if (res.code === 0) {
                that.setData({
                    addressList: res.data
                });
            } else if (res.code === 700) {
                that.setData({
                    addressList: null
                });
            }
        });
    }

});
