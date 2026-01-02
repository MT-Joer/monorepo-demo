const WXAPI = require("apifm-wxapi");

const AUTH = require("../../utils/auth");

const APP = getApp();

Page({

    /**
   * 页面的初始数据
   */
    data: {},

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad (options) {},

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady () {},

    /**
   * 生命周期函数--监听页面显示
   */
    onShow () {
        wx.getLocation({
            type: "gcj02", // wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: (res) => {
                this.data.latitude = res.latitude;
                this.data.longitude = res.longitude;
                this.fetchShops(res.latitude, res.longitude, "");
            },
            fail(e){
                console.error(e);
                AUTH.checkAndAuthorize("scope.userLocation");
            }
        });
    },
    async fetchShops(latitude, longitude, kw){
        const res = await WXAPI.fetchShops({
            curlatitude: latitude,
            curlongitude: longitude,
            nameLike: kw
        });
        if (res.code === 0) {
            res.data.forEach(ele => {
                ele.distance = ele.distance.toFixed(3); // 距离保留3位小数
            });
            this.setData({
                shops: res.data
            });
        } else {
            this.setData({
                shops: null
            });
        }
    },
    /**
   * 生命周期函数--监听页面隐藏
   */
    onHide () {},

    /**
   * 生命周期函数--监听页面卸载
   */
    onUnload () {},

    /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
    onPullDownRefresh () {},

    /**
   * 页面上拉触底事件的处理函数
   */
    onReachBottom () {},
    searchChange(event){
        this.setData({
            searchValue: event.detail.value
        });
    },
    search(event){
        console.log("search");
        this.setData({
            searchValue: event.detail.value
        });
        this.fetchShops(this.data.latitude, this.data.longitude, event.detail.value);
    },
    goShop(e){
        const idx = e.currentTarget.dataset.idx;
        wx.setStorageSync("shopInfo", this.data.shops[idx]);
        wx.setStorageSync("shopIds", this.data.shops[idx].id);
        wx.setStorageSync("refreshIndex", 1);
        wx.switchTab({
            url: "/pages/index/index"
        });
    }
});
