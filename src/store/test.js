import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useTestStore = defineStore(
    'test',
    () => {
        const count = ref(1)
        const doubleCount = computed(() => count.value * 2)
        const increment = () => {
            count.value++
        }
        return { count, doubleCount, increment }
    },
    {
        persistence: {
            key: 'test',
            enabled: true,
            includePaths: ['count'],
        },
    }
)
