import { ref } from 'vue';

const store = ref({})

export function useStore() {
    return store;
}