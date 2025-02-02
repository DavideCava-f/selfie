import { ref } from 'vue';

const store = ref({})

export default function useStore() {
    return store;
}