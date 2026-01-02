<template>
    <VbenCountToAnimator :duration="3000"
                         :end-val="2000000"
                         prefix="$"
                         separator="/"
                         :start-val="1" />
</template>
<script lang="ts" setup>
import { VbenCountToAnimator } from "@vben/common-ui";
</script>
