const WXAPI = require("apifm-wxapi");

const APP = getApp();
// fixed首次打开不显示标题的bug
APP.configLoadOK = () => {
    wx.setNavigationBarTitle({});
};
Page({

    /**
   * 页面的初始数据
   */
    data: {
        aliveRooms: [],
        useFingerprintEmoji: false   // 新增
    },
    onLoad (options) {
        this.wxaMpLiveRooms();
        this.setData({ useFingerprintEmoji: this.shouldUseFingerprintEmoji() });
    },
    onShow () {},
    async wxaMpLiveRooms(){
        wx.showLoading({
            title: "",
        });
        const res = await WXAPI.wxaMpLiveRooms();
        wx.hideLoading({
            success: (res) => {},
        });
        if (res.code === 0 && res.data.length > 0) {
            res.data.forEach(ele => {
                if (ele.start_time) {
                    ele.start_time_str = new Date(ele.start_time*1000).format("yyyy-MM-dd h:m:s");
                }
            });
            this.setData({
                aliveRooms: res.data
            });
        }
    },
    onPullDownRefresh() {
    // console.log('ppppp')
        this.setData({
            curPage: 1
        });
        this.wxaMpLiveRooms();
        wx.stopPullDownRefresh();
    },
    goLiveRoom(e) {
        const roomId = e.currentTarget.dataset.id;
        const status = e.currentTarget.dataset.status;
        if (status === 107 || status === 106 || status === 104) {
            return;
        }
        wx.navigateTo({
            url: `plugin-private://wx2b03c6e691cd7370/pages/live-player-plugin?room_id=${roomId}`
        });
    },
    /* 与 sign 页完全相同的判断逻辑*/
    shouldUseFingerprintEmoji() {
        try {
            const info = wx.getDeviceInfo ? wx.getDeviceInfo() : wx.getSystemInfoSync();
            const plat = (info.platform || "").toLowerCase();
            const sys  = info.system || "";

            if (plat === "android") {
                const m = sys.match(/Android\s+(\d+)/);
                return m ? (Number.parseInt(m[1]) >= 16) : false;
            }
            if (plat === "ios") {
                const m = sys.match(/iOS\s+(\d+)\.(\d+)/);
                if (!m) return false;
                const major = Number.parseInt(m[1]); const minor = Number.parseInt(m[2]);
                return major > 18 || (major === 18 && minor >= 4);
            }
            if (plat === "windows" || plat === "win32") {
                const m = sys.match(/Windows\s+(\d+)\s*H(\d+)/);
                if (!m) return false;
                const build = Number.parseInt(m[1]); const h = Number.parseInt(m[2]);
                return build >= 25 && h >= 2;
            }
        } catch {}
        return false;
    }
});
