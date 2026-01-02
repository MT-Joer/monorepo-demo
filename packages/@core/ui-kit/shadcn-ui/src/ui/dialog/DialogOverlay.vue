<template>
    <div class="z-popup inset-0 bg-overlay" :data-dismissable-modal="id"></div>
</template>
<script setup lang="ts">
import { inject } from "vue";

import { useScrollLock } from "@vben-core/composables";

useScrollLock();
const id = inject("DISMISSABLE_MODAL_ID");
</script>
