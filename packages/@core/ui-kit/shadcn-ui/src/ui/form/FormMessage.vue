<template>
    <ErrorMessage :id="formMessageId"
                  as="p"
                  class="text-[0.8rem] text-destructive"
                  :name="toValue(name)" />
</template>

<script lang="ts" setup>
import { toValue } from "vue";

import { ErrorMessage } from "vee-validate";

import { useFormField } from "./useFormField";

const { formMessageId, name } = useFormField();
</script>
