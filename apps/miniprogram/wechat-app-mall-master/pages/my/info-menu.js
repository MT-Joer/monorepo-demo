const WXAPI = require("apifm-wxapi");

const AUTH = require("../../utils/auth");

Page({
    data: {},
    onLoad (options) {},
    onShow () {
        this.getUserApiInfo();
    },
    async getUserApiInfo() {
        const res = await WXAPI.userDetail(wx.getStorageSync("token"));
        if (res.code === 0) {
            const _data = { apiUserInfoMap: res.data, };
            if (res.data.base.mobile) {
                _data.userMobile = res.data.base.mobile;
            }
            if (this.data.order_hx_uids && this.data.order_hx_uids.includes(res.data.base.id)) {
                _data.canHX = true; // 具有扫码核销的权限
            }
            _data.memberChecked = !(res.data.peisongMember && res.data.peisongMember.status === 1);
            this.setData(_data);
        }
    },
    bindMobile() {
        this.setData({
            bindMobileShow: true
        });
    },
    bindMobileOk(e) {
        console.log(e.detail); // 这里是组件里data的数据
        this.setData({
            bindMobileShow: false
        });
        this.getUserApiInfo();
    },
    bindMobileCancel() {
        this.setData({
            bindMobileShow: false
        });
    },
});
