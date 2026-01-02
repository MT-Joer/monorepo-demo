const wxpay = require("../../utils/pay.js");

const app = getApp();
const WXAPI = require("apifm-wxapi");

const AUTH = require("../../utils/auth");

Page({
    data: {
        statusType: [ "待付款", "待发货", "待收货", "待评价", "已完成" ],
        hasRefund: false,
        currentType: 0,
        tabClass: [ "", "", "", "", "" ]
    },
    statusTap (e) {
        const curType = e.currentTarget.dataset.index;
        this.data.currentType = curType;
        this.setData({
            currentType: curType
        });
        this.onShow();
    },
    cancelOrderTap (e) {
        const that = this;
        const orderId = e.currentTarget.dataset.id;
        wx.showModal({
            title: "确定要取消该订单吗？",
            content: "",
            success (res) {
                if (res.confirm) {
                    WXAPI.orderClose(wx.getStorageSync("token"), orderId).then((res) => {
                        if (res.code === 0) {
                            that.onShow();
                        }
                    });
                }
            }
        });
    },
    // refundApply (e) {
    //   // 申请售后
    //   const orderId = e.currentTarget.dataset.id;
    //   const amount = e.currentTarget.dataset.amount;
    //   wx.navigateTo({
    //     url: "/pages/order/refundApply?id=" + orderId + "&amount=" + amount
    //   })
    // },
    toPayTap (e) {
    // 防止连续点击--开始
        if (this.data.payButtonClicked) {
            wx.showToast({
                title: "休息一下~",
                icon: "none"
            });
            return;
        }
        this.data.payButtonClicked = true;
        setTimeout(() => {
            this.data.payButtonClicked = false;
        }, 3000); // 可自行修改时间间隔（目前是3秒内只能点击一次支付按钮）
        // 防止连续点击--结束
        const that = this;
        const orderId = e.currentTarget.dataset.id;
        let money = e.currentTarget.dataset.money;
        const needScore = e.currentTarget.dataset.score;
        WXAPI.userAmount(wx.getStorageSync("token")).then((res) => {
            if (res.code === 0) {
                // 增加提示框
                if (res.data.score < needScore) {
                    wx.showToast({
                        title: "您的积分不足，无法支付",
                        icon: "none"
                    });
                    return;
                }
                let _msg = `订单金额: ${  money  } 元`;
                if (res.data.balance > 0) {
                    _msg += `,可用余额为 ${  res.data.balance  } 元`;
                    if (money - res.data.balance > 0) {
                        _msg += `,仍需微信支付 ${  money - res.data.balance  } 元`;
                    }
                }
                if (needScore > 0) {
                    _msg += `,并扣除 ${  money  } 积分`;
                }
                money = money - res.data.balance;
                wx.showModal({
                    title: "请确认支付",
                    content: _msg,
                    confirmText: "确认支付",
                    cancelText: "取消支付",
                    success (res) {
                        console.log(res);
                        if (res.confirm) {
                            that._toPayTap(orderId, money);
                        } else {
                            console.log("用户点击取消支付");
                        }
                    }
                });
            } else {
                wx.showModal({
                    title: "错误",
                    content: "无法获取用户资金信息",
                    showCancel: false
                });
            }
        });
    },
    _toPayTap (orderId, money){
        const _this = this;
        if (money <= 0) {
            // 直接使用余额支付
            WXAPI.orderPay(wx.getStorageSync("token"), orderId).then((res) => {
                console.log(res, "<-res9999->");
                _this.onShow();
            });
        } else {
            console.log(456, "<-456->");
            wxpay.wxpay("order", money, orderId, "/pages/order/index");
        }
    },
    onLoad (options) {
        if (options && options.type) {
            if (options.type === 99) {
                this.setData({
                    hasRefund: true,
                    currentType: options.type
                });
            } else {
                this.setData({
                    hasRefund: false,
                    currentType: options.type
                });
            }
        }
    },
    onReady () {
    // 生命周期函数--监听页面初次渲染完成

    },
    getOrderStatistics () {
        const that = this;
        WXAPI.orderStatistics(wx.getStorageSync("token")).then((res) => {
            if (res.code === 0) {
                const tabClass = that.data.tabClass;
                tabClass[0] = res.data.count_id_no_pay > 0 ? "red-dot" : "";
                tabClass[1] = res.data.count_id_no_transfer > 0 ? "red-dot" : "";
                tabClass[2] = res.data.count_id_no_confirm > 0 ? "red-dot" : "";
                tabClass[3] = res.data.count_id_no_reputation > 0 ? "red-dot" : "";
                if (res.data.count_id_success > 0) {
                    // tabClass[4] = "red-dot"
                } else {
                    // tabClass[4] = ""
                }

                that.setData({
                    tabClass,
                });
            }
        });
    },
    onShow () {
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.doneShow();
            } else {
                wx.showModal({
                    title: "提示",
                    content: "本次操作需要您的登录授权",
                    cancelText: "暂不登录",
                    confirmText: "前往登录",
                    success(res) {
                        if (res.confirm) {
                            wx.switchTab({
                                url: "/pages/my/index"
                            });
                        } else {
                            wx.navigateBack();
                        }
                    }
                });
            }
        });
    },
    doneShow () {
    // 获取订单列表
        const that = this;
        const postData = {
            token: wx.getStorageSync("token")
            , hasRefund: that.data.hasRefund, };
        if (!postData.hasRefund) {
            postData.status = that.data.currentType;
        }
        this.getOrderStatistics();
        WXAPI.orderList(postData).then((res) => {
            if (res.code === 0) {
                that.setData({
                    orderList: res.data.orderList,
                    logisticsMap: res.data.logisticsMap,
                    goodsMap: res.data.goodsMap
                });
            } else {
                that.setData({
                    orderList: null,
                    logisticsMap: {},
                    goodsMap: {}
                });
            }
        });
    },
});
