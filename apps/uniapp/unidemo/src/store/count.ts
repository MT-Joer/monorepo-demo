import { ref } from "vue";

// src/store/useCountStore.ts
import { defineStore } from "pinia";

export const useCountStore = defineStore(
    "count",
    () => {
        const count = ref(0);
        const increment = () => {
            count.value++;
        };
        const decrement = () => {
            count.value--;
        };
        const reset = () => {
            count.value = 0;
        };
        return {
            count,
            decrement,
            increment,
            reset,
        };
    },
    {
        persist: true,
    },
);
