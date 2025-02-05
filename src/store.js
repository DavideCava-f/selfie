import { computed, ref } from "vue";
import OpenAI from "openai";

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
  openai: new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    defaultHeaders: {},
    dangerouslyAllowBrowser: true,
  }),
});

setInterval(() => (store.value.realTime = Date.now()), 1000);

export { store };
