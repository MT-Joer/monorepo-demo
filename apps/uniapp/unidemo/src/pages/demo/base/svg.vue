<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: 'svg使用',
  },
}
</route>

<template>
    <view class="p-4">
        <view class="text-center m-4">
            svg 多种使用方法
        </view>
        <image class="h-20 w-20"
               mode="scaleToFill"
               src="/static/svg/task.svg" />
        <image class="h-20 w-20"
               mode="scaleToFill"
               :src="iconUrl" />
        <image class="h-20 w-20"
               mode="scaleToFill"
               :src="iconUrl2" />
        <!-- {{ iconRaw }} -->
        <view class="text-center m-4 text-blue-500">
            目前发现，小程序和APP只支持 image 方式
        </view>
        <view class="text-center m-4 text-blue-500">
            下面的几种方式，都不支持
        </view>
        <!-- #ifdef H5 -->
        <TaskComponent class="h-20 w-20" />
        <SvgIcon class="h-20 w-20" name="task"></SvgIcon>
        <SvgIcon class="h-20 w-20" name="dir-task2"></SvgIcon>
    <!-- #endif -->
    </view>
</template>

<script lang="ts" setup>
 
import iconUrl from "./task.svg";
import TaskComponent from "./task.svg?component";
// #ifdef H5
// 小程序不支持 component 方式引入，运行会报错，APP不报错，但是不生效
import iconUrl2 from "./task.svg?url";
// #endif
</script>

<style lang="scss" scoped>
//
</style>
