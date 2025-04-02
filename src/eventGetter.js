import { store } from "@/store";
import { Temporal } from "@js-temporal/polyfill";

async function getEventsOfDay() {
  const response = await fetch(`${store.value.url}:${store.value.port}/event/ofday?day=${Temporal.PlainDate.from(store.value.simDate).add({ days: store.value.dayOffset })}`);
  store.value.eventsOfDay = (await response.json());
  console.log("Events of day:");
  console.log(store.value.eventsOfDay);
}

async function getEventsOfMonth() {
  try {
    const firstDay = store.value.simDate.with({ day: 1 }).add({ months: store.value.monthOffset });
    console.log(firstDay);
    const response = await fetch(`${store.value.url}:${store.value.port}/event/eventOfMonth?firstday=${firstDay}`);
    store.value.eventsOfMonth = (await response.json()).map((date) => {
      return {
        day: Temporal.PlainDate.from(date._id).day,
        events: date.events
      }
    });
    console.log(store.value.eventsOfMonth);
  }
  catch (err) {
    console.log(err);
  }
}

async function getEventsOfWeek() {
  const thisMonday = Temporal.PlainDate.from(store.value.simDate).subtract({ days: Temporal.PlainDate.from(store.value.simDate).dayOfWeek - 1 }).add({ weeks: store.value.weekOffset });
  const response = await fetch(`${store.value.url}:${store.value.port}/event/ofweek?monday=${thisMonday}`);
  store.value.eventsOfWeek = (await response.json()).map((date) => {
    return { day: Temporal.PlainDate.from(date._id).dayOfWeek - 1, events: date.events }
  });
  console.log(store.value.eventsOfWeek);
}


export { getEventsOfDay, getEventsOfMonth, getEventsOfWeek };
