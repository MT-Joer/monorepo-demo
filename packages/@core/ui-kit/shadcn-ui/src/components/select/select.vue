<template>
    <Select v-model="modelValue">
        <SelectTrigger class="flex w-full items-center" :class="props.class">
            <SelectValue class="flex-auto text-left" :placeholder="placeholder" />
            <CircleX v-if="allowClear && modelValue"
                     class="mr-1 size-4 cursor-pointer opacity-50 hover:opacity-100"
                     data-clear-button
                     @click.stop.prevent="handleClear"
                     @pointerdown.stop />
        </SelectTrigger>
        <SelectContent>
            <template v-for="item in options" :key="item.value">
                <SelectItem :value="item.value">
                    {{ item.label }}
                </SelectItem>
            </template>
        </SelectContent>
    </Select>
</template>
<script lang="ts" setup>
import { CircleX } from "@vben-core/icons";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../ui";

interface Props {
  allowClear?: boolean;
  class?: any;
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
    allowClear: false,
});

const modelValue = defineModel<string>();

function handleClear() {
    modelValue.value = undefined;
}
</script>

<style lang="scss" scoped>
button[role='combobox'][data-placeholder] {
  color: hsl(var(--muted-foreground));
}

button {
  --ring: var(--primary);
}
</style>
