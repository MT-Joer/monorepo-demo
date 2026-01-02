<template>
    <section class="flex w-full border-b border-border bg-background transition-all"
             :style="style">
        <slot></slot>
    </section>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

import { computed } from "vue";

interface Props {
  /**
   * 高度
   */
  height: number;
}

const props = withDefaults(defineProps<Props>(), {});

const style = computed((): CSSProperties => {
    const { height } = props;
    return {
        height: `${height}px`,
    };
});
</script>
