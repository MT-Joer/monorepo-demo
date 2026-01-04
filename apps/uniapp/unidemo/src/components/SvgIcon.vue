<template>
    <svg aria-hidden="true">
        <use :fill="color" :href="symbolId" />
    </svg>
</template>

<script lang="ts" setup name="SvgIcon">
const props = withDefaults(
    defineProps<{
    color?: string
    name: string
    prefix?: string
  }>(),
    {
        prefix: "icon",
        name: "",
        color: "#333",
    },
);
const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>
