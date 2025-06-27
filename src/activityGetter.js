import { store } from "@/store";
import { Temporal } from "@js-temporal/polyfill";

async function getActivitiesOfDay() {
  try {
    const response = await fetch(`${store.value.url}:${store.value.port}/activity/ofday?day=${Temporal.PlainDate.from(store.value.simDate).add({ days: store.value.dayOffset })}`);
    store.value.activitiesOfDay = await response.json();
    console.log("Activities of day:");
    console.log(store.value.activitiesOfDay);
  } catch (error) {
    console.log(error);
  }
}

async function getActivitiesOfWeek() {
  try {
    const thisMonday = Temporal.PlainDate.from(store.value.simDate).subtract({ days: Temporal.PlainDate.from(store.value.simDate).dayOfWeek - 1 }).add({ weeks: store.value.weekOffset });
    const response = await fetch(`${store.value.url}:${store.value.port}/activity/ofweek?monday=${thisMonday}`);
    store.value.activitiesOfWeek = (await response.json()).map((date) => {
      return { day: Temporal.PlainDate.from(date._id).dayOfWeek - 1, activities: date.activities }
    });
    console.log("Activities of week:");
    console.log(store.value.activitiesOfWeek);
  } catch (error) {
    console.log(error);
  }
}

async function getActivitiesOfMonth() {
  try {
    const firstDay = store.value.simDate.with({ day: 1 }).add({ months: store.value.monthOffset });
    console.log(firstDay);
    const response = await fetch(`${store.value.url}:${store.value.port}/activity/ofmonth?firstday=${firstDay}`);
    store.value.activitiesOfMonth = (await response.json()).map((date) => {
      return {
        day: Temporal.PlainDate.from(date._id).day,
        activities: date.activities
      }
    });
    console.log(store.value.activitiesOfMonth);
  } catch (err) {
    console.log(err);
  }
}

export { getActivitiesOfDay, getActivitiesOfWeek, getActivitiesOfMonth };
