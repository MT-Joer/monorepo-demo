<template>
    <li aria-hidden="true"
        :class="cn('[&>svg]:size-3.5', props.class)"
        role="presentation">
        <slot>
            <ChevronRight />
        </slot>
    </li>
</template>

<script lang="ts" setup>
import { cn } from "@vben-core/shared/utils";

import { ChevronRight } from "lucide-vue-next";

const props = defineProps<{
  class?: any;
}>();
</script>
