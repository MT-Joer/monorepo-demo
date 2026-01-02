<template>
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <template v-for="item in items" :key="item.title">
            <Card class="w-full" :title="item.title">
                <CardHeader>
                    <CardTitle class="text-xl">
                        {{ item.title }}
                    </CardTitle>
                </CardHeader>

                <CardContent class="flex items-center justify-between">
                    <VbenCountToAnimator class="text-xl"
                                         :end-val="item.value"
                                         prefix=""
                                         :start-val="1" />
                    <VbenIcon class="size-8 flex-shrink-0" :icon="item.icon" />
                </CardContent>
                <CardFooter class="justify-between">
                    <span>{{ item.totalTitle }}</span>
                    <VbenCountToAnimator :end-val="item.totalValue"
                                         prefix=""
                                         :start-val="1" />
                </CardFooter>
            </Card>
        </template>
    </div>
</template>

<script setup lang="ts">
import type { AnalysisOverviewItem } from "../typing";

import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
    VbenCountToAnimator,
    VbenIcon,
} from "@vben-core/shadcn-ui";

interface Props {
  items?: AnalysisOverviewItem[];
}

defineOptions({
    name: "AnalysisOverview",
});

withDefaults(defineProps<Props>(), {
    items: () => [],
});
</script>
