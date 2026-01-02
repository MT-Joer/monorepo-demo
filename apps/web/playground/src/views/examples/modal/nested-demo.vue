<template>
    <Modal title="嵌套弹窗示例">
        <Button type="primary" @click="openNestedModal">
            打开子弹窗
        </Button>
        <BaseModal />
    </Modal>
</template>
<script lang="ts" setup>
import { useVbenModal } from "@vben/common-ui";

import { Button } from "ant-design-vue";

import DragDemo from "./drag-demo.vue";

const [ Modal ] = useVbenModal({
    destroyOnClose: true,
});
const [ BaseModal, baseModalApi ] = useVbenModal({
    connectedComponent: DragDemo,
});

function openNestedModal() {
    baseModalApi.open();
}
</script>
