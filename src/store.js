import { computed, ref } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { getEventsOfWeek, getEventsOfDay, getEventsOfMonth } from "@/eventGetter";
import { getActivitiesOfDay, getActivitiesOfMonth, getActivitiesOfWeek } from "@/activityGetter";
import { getPomodoros } from "@/pomodoroGetter";
import { notipol } from "@/notipol";
import "vue3-toastify/dist/index.css";
import router from "./router/Router.js"

export const NotesList = ref([]);

const store = ref({
  // DATE AND TIME
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

  // url: "https://site232465.tw.cs.unibo.it",
  url: "http://localhost",
  // port: 443,
  port: 8000,

  checkAuth: async () => {
    const response = await fetch(`${store.value.url}:${store.value.port}/checkauth`, {
      credentials: "include"
    });
    return response.ok;
  },

  //EVENTS
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

  // POMODORO
  pomodoros: [],
  activePomodoro: null,
  last_pomodoro: {
    studyTime: 0,
    breakTime: 0,
    cycles: 0,
    completed: false
  },

  //UTILITIES
  toggle: false,
  togglePomodoro: false,

  update: async () => {
    await getEventsOfDay();
    await getEventsOfWeek();
    await getEventsOfMonth();
    await getActivitiesOfDay();
    await getActivitiesOfMonth();
    await getActivitiesOfWeek();
    await getPomodoros();
    store.value.toggle = !store.value.toggle;
    store.value.togglePomodoro = !store.value.togglePomodoro;
  },

  //NOTIFICHE
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
    fiftMin: [Temporal.Duration.from({ minutes: 15 }), "fiftMin"],
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

setInterval(
  () => {
    if (!store.value.checkAuth()) {
      router.push("/login");
    }
  },
  10000
);


export { store };
