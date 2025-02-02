import { computed, ref } from 'vue';

const store = ref({
    realTime: Date.now(),
    deltaTime: 0,
    fakeTime: computed(() => store.value.realTime + store.value.deltaTime),
    formattedRealTime: computed(() => new Date(store.value.realTime).toISOString()),
    formattedFakeTime: computed(() => new Date(store.value.fakeTime).toISOString())
});

setInterval(() => store.value.realTime = Date.now(), 1000);

export { store };