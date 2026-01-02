const WXAPI = require("apifm-wxapi");

// pages/search/index.js



const app = getApp(); // 获取全局
Page({

    /**
   * 页面的初始数据
   */
    data: {
        goods: [],
        isFocus: false,
        inpValue: "",
    },
    TimeId: -1,
    goodsList: [],

    /**
   * 生命周期函数--监听页面显示
   */
    onShow () {
        this.getGoodsList();
    },

    handleInput(e) {
    // console.log(this.data.goodsList, '<-this.data.goodsList->');
        const {
            value
        } = e.detail;
        // console.log(value, '<-value->');
        if (!value.trim()) {
            this.setData({
                goods: [],
                isFocus: false,
            });
            return;
        }
        this.setData({
            isFocus: true,
        });
        clearTimeout(this.TimeId);
        this.TimeId = setTimeout(() => {
            // this.qsearch(value);
            const goodsArr = [];
            if (this.goodsList.length > 0) {
                this.goodsList.map(v => {
                    if (v.name) {
                        const arr = v.name.includes(value) ? v : false;
                        if (arr) {
                            goodsArr.push(arr);
                        }
                    }
                });
            }
            this.setData({
                goods: goodsArr,
            });
        }, 1000);
    },

    async getGoodsList() {
    // const res = await http({
    //   url: "/shop/goods/list",
    // });
    // const {
    //   data
    // } = res;
    // if (res.code === 0) {
    //   this.goodsList = data;
    // }
        await WXAPI.goods().then(res => app.handleDestruction(res))
            .then((data) => {
                this.goodsList = data;
            });
    },

    // async qsearch(query) {
    //   const res = await request({url: "/goods/qsearch", data:{query}});
    //   this.setData({
    //     goods: res,
    //   })
    // },

    handleCancel() {
        this.setData({
            inpValue: "",
            isFocus: false,
            goods: [],
        });
    },

    /**
   * 生命周期函数--监听页面隐藏
   */
});
