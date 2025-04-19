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

  advance: { // non avendo le Tuple ho dovuto adattarmi al meglio delle mie possibilità ♠♥♣♦ 
    oneDay: [Temporal.Duration.from({ days: 1 }), "oneDay"],
    twoDays: [Temporal.Duration.from({ days: 2 }), "twoDays"],
    oneWeek: [Temporal.Duration.from({ days: 7 }), "oneWeek"],
    twoWeeks: [Temporal.Duration.from({ days: 14 }), "twoWeeks"],

    oneHr: [Temporal.Duration.from({ hours: 1 }), "oneHr"],
    twoHr: [Temporal.Duration.from({ hours: 2 }), "twoHr"],
    sixHr: [Temporal.Duration.from({ hours: 6 }), "sixHr"],
    twelveHr: [Temporal.Duration.from({ hours: 12 }), "twelveHr"],

    fiveMin: [Temporal.Duration.from({ minutes: 5 }), "fiveMin"],
    tenMin: [Temporal.Duration.from({ minutes: 10 }), "tenMin"],
    fiftMin: [Temporal.Duration.from({ minutes: 15 }), "fifteenMin"],
    halfHr: [Temporal.Duration.from({ minutes: 30 }), "halfHr"],
  }
});

setInterval(
  () => (store.value.realDateTime = Temporal.Now.plainDateTimeISO()),
  1000,
);

setInterval(
  notipol,
  10000
);

export { store };
