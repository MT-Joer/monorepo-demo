<template>
    <span aria-current="page"
          aria-disabled="true"
          :class="cn('font-normal text-foreground', props.class)"
          role="link">
        <slot></slot>
    </span>
</template>

<script lang="ts" setup>
import { cn } from "@vben-core/shared/utils";

const props = defineProps<{
  class?: any;
}>();
</script>
