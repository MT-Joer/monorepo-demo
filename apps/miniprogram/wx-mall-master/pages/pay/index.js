const WXAPI = require("apifm-wxapi");

// pages/pay/index.js
const AUTH = require("../../utils/auth");

Page({

    /**
   * 页面的初始数据
   */
    data: {
        address: {},
        curAddressData: {},
        cart: [],
        totalPrice: 0,
        totalNum: 0,
        isNeedLogistics: 0,
    // wxlogin: true,
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad (options) {

        let cart = wx.getStorageSync("cart") || [];

        const single = wx.getStorageSync("single") || [];

        cart = cart.filter(v => v.checked);

        // this.setData({ address });
        this.setData({
            isNeedLogistics: 1,
        });

        let totalPrice = 0;
        let totalNum = 0;
        if (single.length > 0) {
            this.setData({
                cart: single,
                totalNum: 1,
                totalPrice: single[0].basicInfo.minPrice,
            });
        } else {
            cart.forEach(v => {
                cart;
                totalPrice += v.num * v.basicInfo.minPrice;
                totalNum += v.num;
            });
            this.setData({
                cart,
                totalPrice,
                totalNum,
            });
        }
    // this.initShippingAddress();
    },

    onShow() {
        this.initShippingAddress();
    },

    async handleOrderPay() {
    // 1 判断缓存中有没有token
        const token = wx.getStorageSync("token");
        // 2 判断
        if (!token) {
            AUTH.login();
            return;
        }
        const order_price = this.data.totalPrice;

        const consignee_addr = this.data.curAddressData;

        const cart = this.data.cart;



        const goods = [];
        cart.forEach(v => goods.push({
            goodsId: v.basicInfo.id,
            number: v.num || 1,
            propertyChildIds: "",
            logisticsType: 0
        }));

        const postData = {
            token,
            goodsJsonStr: JSON.stringify(goods),
            address: consignee_addr.address,
            linkMan: consignee_addr.linkMan,
            mobile: consignee_addr.mobile,
            provinceId: consignee_addr.provinceId,
            cityId: consignee_addr.cityId,
            code: consignee_addr.code,
        };
        await this.CreateOrder(postData);
        wx.navigateTo({
            url: "/pages/order/index"
        });
    },

    async CreateOrder(params) {
        await WXAPI.orderCreate(params).then((res) => {
            if (res.code !== 0) {
                wx.showModal({
                    title: "错误",
                    content: res.msg,
                    showCancel: false
                });

            }
        });
        wx.removeStorageSync("single");
        this.clearPayProduct();
    },

    clearPayProduct() {

        const cartTotal = wx.getStorageSync("cart") || [];

        const newCart = cartTotal.filter(val => val.checked === false);

        wx.setStorageSync("cart", newCart);
    },
    //

    async initShippingAddress() {
        const res = await WXAPI.defaultAddress(wx.getStorageSync("token"));
        if (res.code === 0) {
            this.setData({
                curAddressData: res.data.info
            });
        } else {
            this.setData({
                curAddressData: null
            });
        }
    },

    addAddress () {
        wx.navigateTo({
            url: "/pages/address-add/index"
        });
    },
    selectAddress () {
        wx.navigateTo({
            url: "/pages/select-address/index"
        });
    },
    onUnload() {
        wx.removeStorageSync("single");
    }
});
