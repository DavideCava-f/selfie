import { computed, ref } from "vue";
// import OpenAI from "openai";
import { Temporal } from "@js-temporal/polyfill";
import { getEventsOfWeek, getEventsOfDay, getEventsOfMonth } from "@/eventGetter";
import { getActivitiesOfDay, getActivitiesOfMonth, getActivitiesOfWeek } from "@/activityGetter";
import { notipol } from "@/notipol";

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

  //url: "https://site232465.tw.cs.unibo.it",
  url: "http://localhost",
  //port: 443,
  port: 8000,

  checkAuth: async () => {
    const response = await fetch(`${store.value.url}:${store.value.port}/checkauth`, {
      credentials: "include"
    });
    return response.ok;
  },

  activeEventId: null,
  activeDate: null,

  eventsOfDay: [],
  dayOffset: 0,
  eventsOfMonth: [],
  monthOffset: 0,
  eventsOfWeek: [],
  weekOffset: 0,

  activitiesOfDay: [],
  activitiesOfWeek: [],
  activitiesOfMonth: [],

  toggle: false,

  update: () => {
    getEventsOfDay();
    getEventsOfWeek();
    getEventsOfMonth();
    getActivitiesOfDay();
    getActivitiesOfMonth();
    getActivitiesOfWeek();
    store.value.toggle = !store.value.toggle;
  },

  advance: []
});

setInterval(
  () => (store.value.realDateTime = Temporal.Now.plainDateTimeISO()),
  1000,
);

setInterval(
  notipol,
  5000
);

export { store };
