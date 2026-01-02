<template>
    <Fallback description="当前路由在菜单中不可见"
              show-back
              status="coming-soon"
              title="被隐藏的子菜单">
        <template #action>
            <VbenButton size="lg" @click="closeCurrentTab()">
                <X class="mr-2 size-4" />
                关闭当前标签页
            </VbenButton>
        </template>
    </Fallback>
</template>

<script lang="ts" setup>
import { Fallback, VbenButton } from "@vben/common-ui";
import { useTabs } from "@vben/hooks";
import { X } from "@vben/icons";

const { closeCurrentTab } = useTabs();
</script>
