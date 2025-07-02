import { store } from "@/store";
import { Temporal } from "@js-temporal/polyfill";

async function getActivitiesOfDay() {
  try {
    const response = await fetch(`${store.value.url}:${store.value.port}/activity/ofday?day=${Temporal.PlainDate.from(store.value.simDate).add({ days: store.value.dayOffset })}`, {
      credentials: "include"
    });
    store.value.activitiesOfDay = await response.json();
  } catch (error) {
    console.log(error);
  }
}

async function getActivitiesOfWeek() {
  try {
    const thisMonday = Temporal.PlainDate.from(store.value.simDate).subtract({ days: Temporal.PlainDate.from(store.value.simDate).dayOfWeek - 1 }).add({ weeks: store.value.weekOffset });
    const response = await fetch(`${store.value.url}:${store.value.port}/activity/ofweek?monday=${thisMonday}`, {
      credentials: "include"
    });
    store.value.activitiesOfWeek = (await response.json()).map((date) => {
      return { day: Temporal.PlainDate.from(date._id).dayOfWeek - 1, activities: date.activities }
    });
  } catch (error) {
    console.log(error);
  }
}

async function getActivitiesOfMonth() {
  try {
    const firstDay = store.value.simDate.with({ day: 1 }).add({ months: store.value.monthOffset });
    const response = await fetch(`${store.value.url}:${store.value.port}/activity/ofmonth?firstday=${firstDay}`, {
      credentials: "include"
    });
    store.value.activitiesOfMonth = (await response.json()).map((date) => {
      return {
        day: Temporal.PlainDate.from(date._id).day,
        activities: date.activities
      }
    });
  } catch (err) {
    console.log(err);
  }
}

export { getActivitiesOfDay, getActivitiesOfWeek, getActivitiesOfMonth };
