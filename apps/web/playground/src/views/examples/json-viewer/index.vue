<template>
    <Page description="一个渲染 JSON 结构数据的组件，支持复制、展开等，简单易用"
          title="Json Viewer">
        <Card title="默认配置">
            <JsonViewer :value="json1" />
        </Card>
        <Card class="mt-4" title="可复制、默认展开3层、显示边框、事件处理">
            <JsonViewer boxed
                        copyable
                        :expand-depth="3"
                        :sort="false"
                        :value="json2"
                        @copied="handleCopied"
                        @key-click="handleKeyClick"
                        @value-click="handleValueClick" />
        </Card>
        <Card class="mt-4" title="预览模式">
            <JsonViewer copyable
                        preview-mode
                        :show-array-index="false"
                        :value="json2" />
        </Card>
    </Page>
</template>
<script lang="ts" setup>
import type { JsonViewerAction, JsonViewerValue } from "@vben/common-ui";

import { JsonViewer, Page } from "@vben/common-ui";

import { Card, message } from "ant-design-vue";

import { json1, json2 } from "./data";

function handleKeyClick(key: string) {
    message.info(`点击了Key ${key}`);
}

function handleValueClick(value: JsonViewerValue) {
    message.info(`点击了Value ${JSON.stringify(value)}`);
}

function handleCopied(_event: JsonViewerAction) {
    message.success("已复制JSON");
}
</script>
