<template>
    <div class="z-popup inset-0 bg-overlay" :data-dismissable-drawer="id"></div>
</template>
<script setup lang="ts">
import { inject } from "vue";

import { useScrollLock } from "@vben-core/composables";

useScrollLock();
const id = inject("DISMISSABLE_DRAWER_ID");
</script>
