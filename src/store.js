import { computed, ref } from 'vue';

const store = ref({
    realTime: Date.now(),
    deltaTime: 0,
    simTime: computed(() => store.value.realTime + store.value.deltaTime),
    formattedRealTime: computed(() => new Date(store.value.realTime).toISOString()),
    formattedSimTime: computed(() => new Date(store.value.simTime).toISOString()),
    formattedRealDate: computed(() => store.value.formattedRealTime.split("T")[0]),
    formattedSimDate: computed(() => store.value.formattedSimTime.split("T")[0]),
    formattedRealHourMinSec: computed(() => store.value.formattedRealTime.split("T")[1].slice(0, 8)),
    formattedSimHourMinSec: computed(() => store.value.formattedSimTime.split("T")[1].slice(0, 8))
});

setInterval(() => store.value.realTime = Date.now(), 1000);

export { store };
