import { computed, ref } from "vue";
import OpenAI from "openai";

const store = ref({
  realTime: Date.now(),
  deltaTime: 0,
  fakeTime: computed(() => store.value.realTime + store.value.deltaTime),
  formattedRealTime: computed(() =>
    new Date(store.value.realTime).toISOString(),
  ),
  formattedFakeTime: computed(() =>
    new Date(store.value.fakeTime).toISOString(),
  ),
  openai: new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
    defaultHeaders: {},
    dangerouslyAllowBrowser: true,
  }),
});

setInterval(() => (store.value.realTime = Date.now()), 1000);

export { store };
