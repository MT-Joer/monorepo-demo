<route lang="json5">
{
  layout: 'demo',
  style: { navigationBarTitleText: 'UniUI Icons 使用' },
}
</route>

<template>
    <view class="m-4">
        <uni-icons size="30" type="contact"></uni-icons>
        <uni-icons color="red"
                   size="30"
                   type="contact">
        </uni-icons>
        <uni-icons class="text-green"
                   size="30"
                   type="contact">
        </uni-icons>
        <uni-icons class="text-green"
                   color="red"
                   size="30"
                   type="contact">
        </uni-icons>
        <uni-icons class="text-green"
                   color="red"
                   size="30"
                   type="contact">
        </uni-icons>
        <uni-icons class="text-green w-4"
                   color="red"
                   type="contact">
        </uni-icons>
        <uni-icons class="text-green w-8"
                   color="red"
                   type="contact">
        </uni-icons>
        <uni-icons class="text-green w-8"
                   :color="colorName"
                   :type="iconName">
        </uni-icons>
    </view>
</template>
<script lang="ts" setup>
const iconName = ref<string>("contact");
const colorName = ref<string>("red");
onLoad(() => {
    setTimeout(() => {
        iconName.value = "chat";
        colorName.value = "green";
    }, 1000);
});
</script>
