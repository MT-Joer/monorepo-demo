<template>
    <div class="flex w-full gap-1">
        <Select v-model:value="modelValue[0]"
                allow-clear
                class="w-[80px]"
                :class="{ 'valid-success': !!modelValue[0] }"
                :options="[
                    { label: '个人', value: 'personal' },
                    { label: '工作', value: 'work' },
                    { label: '私密', value: 'private' },
                ]"
                placeholder="类型"
                @blur="emit('blur')"
                @change="onChange" />
        <Input v-model:value="modelValue[1]"
               allow-clear
               class="flex-1"
               :class="{ 'valid-success': modelValue[1]?.match(/^1[3-9]\d{9}$/) }"
               :maxlength="11"
               placeholder="请输入11位手机号码"
               type="tel"
               @blur="emit('blur')"
               @change="onChange" />
    </div>
</template>
<script lang="ts" setup>
import { Input, Select } from "ant-design-vue";

const emit = defineEmits([ "blur", "change" ]);

const modelValue = defineModel<[string, string]>({
    default: () => [ undefined, undefined ],
});

function onChange() {
    emit("change", modelValue.value);
}
</script>
