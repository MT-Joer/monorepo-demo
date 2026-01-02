<template>
    <nav aria-label="breadcrumb"
         :class="props.class"
         role="navigation">
        <slot></slot>
    </nav>
</template>

<script lang="ts" setup>
const props = defineProps<{
  class?: any;
}>();
</script>
