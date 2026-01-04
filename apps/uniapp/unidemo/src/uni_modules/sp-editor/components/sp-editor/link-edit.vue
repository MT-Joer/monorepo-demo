<template>
    <view v-if="showPopup" class="link-edit-container">
        <view class="link-edit">
            <view class="title">
                添加链接
            </view>
            <view class="edit">
                <view class="description">
                    链接描述：
                    <input v-model="descVal"
                           class="input"
                           placeholder="请输入链接描述"
                           type="text" />
                </view>
                <view class="address">
                    链接地址：
                    <input v-model="addrVal"
                           class="input"
                           placeholder="请输入链接地址"
                           type="text" />
                </view>
            </view>
            <view class="control">
                <view class="cancel" @click="close">
                    取消
                </view>
                <view class="confirm" @click="onConfirm">
                    确认
                </view>
            </view>
        </view>
        <view class="mask"></view>
    </view>
</template>

<script>
export default {
    data() {
        return {
            showPopup: false,
            descVal: "",
            addrVal: ""
        };
    },
    methods: {
        open() {
            this.showPopup = true;
            this.$emit("open");
        },
        close() {
            this.showPopup = false;
            this.descVal = "";
            this.addrVal = "";
            this.$emit("close");
        },
        onConfirm() {
            if (!this.descVal) {
                uni.showToast({
                    title: "请输入链接描述",
                    icon: "none"
                });
                return;
            }
            if (!this.addrVal) {
                uni.showToast({
                    title: "请输入链接地址",
                    icon: "none"
                });
                return;
            }
            this.$emit("confirm", {
                text: this.descVal,
                href: this.addrVal
            });
            this.close();
        }
    }
};
</script>

<style lang="scss">
.link-edit-container {
  .link-edit {
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    box-sizing: border-box;
    width: 80%;
    font-size: 14px;
    background-color: #fff;
    border-radius: 12rpx;
    box-shadow: -2px -2px 4px rgb(0 0 0 / 5%), 2px 2px 4px rgb(0 0 0 / 5%);
    transform: translate(-50%, -50%);

    .title {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 80rpx;
    }

    .edit {
      box-sizing: border-box;
      padding: 24rpx;
      border-top: 1px solid #eee;
      border-bottom: 1px solid #eee;

      .input {
        flex: 1;
        padding: 4px;
        font-size: 14px;
        border: 1px solid #eee;
        border-radius: 8rpx;

        .uni-input-placeholder {
          color: #ddd;
        }
      }

      .description {
        display: flex;
        align-items: center;
      }

      .address {
        display: flex;
        align-items: center;
        margin-top: 24rpx;
      }
    }

    .control {
      display: flex;
      height: 80rpx;
      cursor: pointer;

      .cancel {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        color: #dd524d;
      }

      .confirm {
        display: flex;
        flex: 1;
        align-items: center;
        justify-content: center;
        color: #007aff;
        border-left: 1px solid #eee;
      }
    }
  }

  .mask {
    position: absolute;
    inset: 0;
    z-index: 998;
    background-color: rgb(0 0 0 / 5%);
  }
}
</style>
