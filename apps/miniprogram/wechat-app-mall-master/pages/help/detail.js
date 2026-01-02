const WXAPI = require("apifm-wxapi");

Page({
    data: {},
    onLoad (options) {
    // options.id = 34094
        this.data.id = options.id;
        this.fetchDetail();
    },
    onShow () {},
    async fetchDetail() {
        const res = await WXAPI.cmsArticleDetailV3({ id: this.data.id });
        if (res.code === 0) {
            this.setData({
                cmsArticleDetail: res.data.info
            });
            wx.setNavigationBarTitle({
                title: res.data.info.title,
            });
        }
    },
    onShareAppMessage() {
        const uid = wx.getStorageSync("uid");
        return {
            title: `${wx.getStorageSync("mallName")  } - ${  this.data.cmsArticleDetail.title}`,
            path: `/pages/help/detail?id=${this.data.id}&inviter_id=${ uid || ""}`,
            imageUrl: wx.getStorageSync("share_pic")
        };
    },
    onShareTimeline() {
        const uid = wx.getStorageSync("uid");
        return {
            title: `${wx.getStorageSync("mallName")  } - ${  this.data.cmsArticleDetail.title}`,
            query: `id=${this.data.id}&inviter_id=${ uid || ""}`,
            imageUrl: wx.getStorageSync("share_pic")
        };
    },
});
