import { computed, ref } from "vue";
import OpenAI from "openai";
import { Temporal } from "@js-temporal/polyfill";

export const NotesList = ref([]);

const store = ref({
  realDateTime: Temporal.Now.plainDateTimeISO(),
  deltaDateTime: Temporal.Duration.from({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  }),
  simDateTime: computed(() =>
    store.value.realDateTime.add(store.value.deltaDateTime),
  ),

  realDate: computed(() => store.value.realDateTime.toPlainDate()),
  simDate: computed(() => store.value.simDateTime.toPlainDate()),

  realTime: computed(() =>
    store.value.realDateTime.toPlainTime().toString().slice(0, 8),
  ),
  simTime: computed(() =>
    store.value.simDateTime.toPlainTime().toString().slice(0, 8),
  ),

  realDay: computed(() => store.value.realDate.dayOfWeek - 1),
  simDay: computed(() => store.value.simDate.dayOfWeek - 1),

  week: [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ],

  timeZone: "Europe/Rome",

  // openai: new OpenAI({
  // baseURL: "https://openrouter.ai/api/v1",
  // apiKey: import.meta.env.VITE_OPEN_AI_API_KEY,
  // defaultHeaders: {},
  // dangerouslyAllowBrowser: true,
  // }),

  // url: "https://site232465.tw.cs.unibo.it"
  url: "http://localhost",
  port: 8000,

  checkAuth: async () => {
    const response = await fetch(`${store.value.url}:${store.value.port}/checkauth`, {
      credentials: "include"
    });
    return response.ok;
  },

  eventsOfDay: [],
  getEventsOfDay: async (day) => {
    // FIXME: farlo lato server (query database) + gestire timeZone
    const response = await fetch(`${store.value.url}:${store.value.port}/event`);
    store.value.eventsOfDay = (await response.json()).filter((event) => event.dates.every((date) => Temporal.PlainDate.compare(Temporal.PlainDate.from(day), Temporal.PlainDate.from(date.begin.slice(0, -1))) === 0));
  },

  eventsOfWeek: [],
  getEventsOfWeek: async (baseDay) => {
    const thisMonday = Temporal.PlainDate.from(baseDay).subtract({ days: Temporal.PlainDate.from(baseDay).dayOfWeek - 1 });
    const response = await fetch(`${store.value.url}:${store.value.port}/event/ofweek?monday=${thisMonday}`);
    store.value.eventsOfWeek = (await response.json()).map((date) => {
      return { day: Temporal.PlainDate.from(date._id).dayOfWeek - 1, events: date.events }
    });
    console.log(store.value.eventsOfWeek);
  }

});

setInterval(
  () => (store.value.realDateTime = Temporal.Now.plainDateTimeISO()),
  1000,
);

export { store };
