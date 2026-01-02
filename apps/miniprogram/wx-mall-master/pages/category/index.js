// pages/category/index.js




const WXAPI = require("apifm-wxapi");

const app = getApp();
Page({

    /**
   * 页面的初始数据
   */
    data: {
        cateList: [],
        leftMenuList: [],
        rightContent: [],
        currentIndex: 0,
        scrollTop: 0,
    },
    Cates: [],

    /**
   * 生命周期函数--监听页面加载
   */
    onShow () {},
    onLoad (options) {

        const {
            custom
        } = getApp().globalData;

        this.handleItemTap(custom);


        const CatesName = wx.getStorageSync("CatesName");
        const CatesList = wx.getStorageSync("CatesList");
        if (CatesName) {
            if (Date.now() - CatesName.time > 1000 * 10) {
                this.getCatesList();
            } else {
                // 可以使用旧的数据
                // const { custom = {} } = getApp().globalData;
                this.Cates = CatesList.data;
                const leftMenuList = CatesName.data;
                let rightContent = null;
                rightContent = custom ? this.Cates.filter(v => v.categoryId === custom.id) : this.Cates.filter(v => v.categoryId === leftMenuList[0].id);
                this.setData({
                    leftMenuList,
                    rightContent
                });
            }
        } else {
            this.getCatesList();
        }
    },
    async getCatesList() {
        const that = this;
        const {
            custom
        } = getApp().globalData;

        await WXAPI.goodsCategory().then(res => app.handleDestruction(res))
            .then((data) => {
                const leftMenuList = data.map(v => {
                    return {
                        id: v.id,
                        name: v.name
                    };
                });
                wx.setStorageSync("CatesName", {
                    time: Date.now(),
                    data: leftMenuList
                });
                this.setData({
                    leftMenuList,
                });
            });

        await WXAPI.goods().then(res => app.handleDestruction(res))
            .then((data) => {
                this.Cates = data;
                wx.setStorageSync("CatesList", {
                    time: Date.now(),
                    data: this.Cates
                });
                let rightContent = null;
                rightContent = custom ? data.filter(v => v.categoryId === custom.id) : data.filter(v => v.categoryId === this.data.leftMenuList[0].id);
                this.setData({
                    rightContent,
                });
            });
    },
    handleItemTap(e) {
        let id = null;
        let index = 0;
        if (e) {
            if (e.currentTarget) {
                id = e.currentTarget.dataset.id;
                index = e.currentTarget.dataset.index;
            } else {
                id = e.id;
                index = e.index;
            }
        }

        const rightContent = this.Cates.filter(v => v.categoryId === id);
        this.setData({
            currentIndex: index,
            rightContent,
            scrollTop: 0,
        });

    // const {
    //   id,
    //   index,
    // } = e.currentTarget.dataset;
    },
});
