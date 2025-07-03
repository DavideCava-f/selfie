import { store } from "@/store";
import { Temporal } from "@js-temporal/polyfill";

async function getEventsOfDay() {
  const response = await fetch(`${store.value.url}:${store.value.port}/event/ofday?day=${Temporal.PlainDate.from(store.value.simDate).add({ days: store.value.dayOffset })}`, {
    credentials: "include"
  });
  store.value.eventsOfDay = (await response.json());
  
}

async function getEventsOfMonth() {
  try {
    const firstDay = store.value.simDate.with({ day: 1 }).add({ months: store.value.monthOffset });
    const response = await fetch(`${store.value.url}:${store.value.port}/event/eventOfMonth?firstday=${firstDay}`, {
      credentials: "include"
    });
    store.value.eventsOfMonth = (await response.json()).map((date) => {
      return {
        day: Temporal.PlainDate.from(date._id).day,
        events: date.events
      }
    });
  }
  catch (err) {
  }
}

async function getEventsOfWeek() {
  const thisMonday = Temporal.PlainDate.from(store.value.simDate).subtract({ days: Temporal.PlainDate.from(store.value.simDate).dayOfWeek - 1 }).add({ weeks: store.value.weekOffset });
  const response = await fetch(`${store.value.url}:${store.value.port}/event/ofweek?monday=${thisMonday}`, {
    credentials: "include"
  });
  store.value.eventsOfWeek = (await response.json()).map((date) => {
    return { day: Temporal.PlainDate.from(date._id).dayOfWeek - 1, events: date.events }
  });
}


export { getEventsOfDay, getEventsOfMonth, getEventsOfWeek };
