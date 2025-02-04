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
    apiKey:
      "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",
    defaultHeaders: {},
    dangerouslyAllowBrowser: true,
  }),
});

setInterval(() => (store.value.realTime = Date.now()), 1000);

export { store };
