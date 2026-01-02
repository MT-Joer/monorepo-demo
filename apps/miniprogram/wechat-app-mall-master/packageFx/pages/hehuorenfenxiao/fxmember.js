const WXAPI = require("apifm-wxapi");

const AUTH = require("../../../utils/auth");


Page({

    /**
   * 页面的初始数据
   */
    data: {
        level:0,
        description:""
    },

    /**
   * 生命周期函数--监听页面加载
   */
    onLoad (options) {
        const level = options.level;
        if (level===0){
            wx.setNavigationBarTitle({
                title: "团队长列表",
            });
            this.setData({
                description:"暂无团队长"
            });
        }
        if (level===1){
            wx.setNavigationBarTitle({
                title: "团员列表",
            });
            this.setData({
                description:"暂无团员"
            });
        }
        AUTH.checkHasLogined().then(isLogined => {
            if (isLogined) {
                this.fxMembers(level);
            } else {
                getApp().loginOK = () => {
                    this.fxMembers(level);
                };
            }
        });
    },

    /**
   * 生命周期函数--监听页面初次渲染完成
   */
    onReady () {},

    /**
   * 生命周期函数--监听页面显示
   */
    onShow () {},

    getUserApiInfo () {
        const that = this;
        WXAPI.userDetail(wx.getStorageSync("token")).then((res) => {
            if (res.code === 0) {
                const _data = { apiUserInfoMap: res.data, };
                if (res.data.base.mobile) {
                    _data.userMobile = res.data.base.mobile;
                }
                if (that.data.order_hx_uids && that.data.order_hx_uids.includes(res.data.base.id)) {
                    _data.canHX = true; // 具有扫码核销的权限
                }
                const adminUserIds = wx.getStorageSync("adminUserIds");
                if (adminUserIds && adminUserIds.includes(res.data.base.id)) {
                    _data.isAdmin = true;
                }
                _data.memberChecked = !(res.data.peisongMember && res.data.peisongMember.status === 1);
                that.setData(_data);
                that.commision();
            }
        });
    },


    cancelLogin() {
        wx.switchTab({
            url: "/pages/my/index"
        });
    },
    processLogin(e) {
        if (!e.detail.userInfo) {
            wx.showToast({
                title: "已取消",
                icon: "none",
            });
            return;
        }
        AUTH.register(this);
    },

    async fxMembers(level){
        const res = await WXAPI.partnerMembers({
            token:wx.getStorageSync("token"),
            type:level
        });
        if (res.code===0){
            this.setData({
                memberList:res.data
            });
        }
        console.log("fxmenber", res);
    }
});
