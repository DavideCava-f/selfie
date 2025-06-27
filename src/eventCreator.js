import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";

class EventCreator {
  static insertNDaily(
    n,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      dates: [],
      title: eventTitle,
      details: {
        text: eventText,
        link: eventLink,
      },
    };
    const baseBeginDateTime = Temporal.PlainDateTime.from(
      `${eventBeginDate}T${eventBeginTime}:00.000`,
    );
    const baseEndDateTime = Temporal.PlainDateTime.from(
      `${eventEndDate}T${eventEndTime}:00.000`,
    );
    for (let i = 0; i < n; i++) {
      event.dates.push({
        begin: baseBeginDateTime.add({ days: i }).toString() + "Z",
        end: baseEndDateTime.add({ days: i }).toString() + "Z",
        noted: false
      });
    }
    for (const d in store.value.advance) {
      const i = Object.keys(store.value.advance).indexOf(d);
      console.log(i);
      if (notificationSelected[i]) {
        event.notification.advance.push(store.value.advance[d][1]);
      }
    }
    console.log(event);
    return fetch(`${store.value.url}:${store.value.port}/event`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static insertUntilDaily(
    untilDate,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      dates: [],
      title: eventTitle,
      details: {
        text: eventText,
        link: eventLink,
      },
    };
    const baseBeginDateTime = Temporal.PlainDateTime.from(
      `${eventBeginDate}T${eventBeginTime}:00.000`,
    );
    const baseEndDateTime = Temporal.PlainDateTime.from(
      `${eventEndDate}T${eventEndTime}:00.000`,
    );
    let i = 0;
    do {
      event.dates.push({
        begin: baseBeginDateTime.add({ days: i }).toString() + "Z",
        end: baseEndDateTime.add({ days: i }).toString() + "Z",
        noted: false
      });
      i++;
    } while (
      Temporal.PlainDate.compare(
        Temporal.PlainDate.from(eventEndDate).add({ days: i }),
        Temporal.PlainDate.from(untilDate),
      ) !== 1
    );
    for (const d in store.value.advance) {
      const i = Object.keys(store.value.advance).indexOf(d);
      console.log(i);
      if (notificationSelected[i]) {
        event.notification.advance.push(store.value.advance[d][1]);
      }
    }
    console.log(event);
    return fetch(`${store.value.url}:${store.value.port}/event`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static insertNWeekly(
    n,
    weekDays,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      dates: [],
      title: eventTitle,
      details: {
        text: eventText,
        link: eventLink,
      },
    };
    const baseBeginDateTime = Temporal.PlainDateTime.from(
      `${eventBeginDate}T${eventBeginTime}:00.000`,
    );
    const baseEndDateTime = Temporal.PlainDateTime.from(
      `${eventEndDate}T${eventEndTime}:00.000`,
    );
    const weekDaysOn = weekDays
      .map((o, i) => [o, i])
      .filter((d) => d[0])
      .map((d) => d[1]);
    const baseWeekDay = baseBeginDateTime.dayOfWeek - 1;
    const weekDaysOnDateTime = weekDaysOn.map((d) => {
      return {
        begin: baseBeginDateTime.add({ days: d - baseWeekDay }),
        end: baseEndDateTime.add({ days: d - baseWeekDay }),
      };
    });
    for (let i = 0; i < n; i++) {
      weekDaysOnDateTime.forEach((d) => {
        event.dates.push({
          begin: d.begin.add({ weeks: i }),
          end: d.end.add({ weeks: i }),
        });
      });
    }
    event.dates
      .filter(
        (d) => Temporal.PlainDateTime.compare(baseBeginDateTime, d.begin) === 1,
      )
      .forEach((d) => {
        d.begin = d.begin.add({ weeks: n }).toString() + "Z";
        d.end = d.end.add({ weeks: n }).toString() + "Z";
        d.noted = false;
      });
    for (const d in store.value.advance) {
      const i = Object.keys(store.value.advance).indexOf(d);
      console.log(i);
      if (notificationSelected[i]) {
        event.notification.advance.push(store.value.advance[d][1]);
      }
    }
    return fetch(`${store.value.url}:${store.value.port}/event`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static insertUntilWeekly(
    untilDate,
    weekDays,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      dates: [],
      title: eventTitle,
      details: {
        text: eventText,
        link: eventLink,
      },
    };
    const baseBeginDateTime = Temporal.PlainDateTime.from(
      `${eventBeginDate}T${eventBeginTime}:00.000`,
    );
    const baseEndDateTime = Temporal.PlainDateTime.from(
      `${eventEndDate}T${eventEndTime}:00.000`,
    );
    const weekDaysOn = weekDays
      .map((o, i) => [o, i])
      .filter((d) => d[0])
      .map((d) => d[1]);
    const baseWeekDay = baseBeginDateTime.dayOfWeek - 1;
    const weekDaysOnDateTime = weekDaysOn.map((d) => {
      return {
        begin: baseBeginDateTime.add({ days: d - baseWeekDay }),
        end: baseEndDateTime.add({ days: d - baseWeekDay }),
      };
    });
    let i = 0;
    do {
      weekDaysOnDateTime.forEach((d) => {
        event.dates.push({
          begin: d.begin.add({ weeks: i }),
          end: d.end.add({ weeks: i })
        });
      });
      i++;
    } while (
      Temporal.PlainDate.compare(
        Temporal.PlainDate.from(event.dates.slice(-1)[0].end),
        Temporal.PlainDate.from(untilDate),
      ) !== 1
    );
    event.dates = event.dates
      .filter(
        (d) => Temporal.PlainDateTime.compare(baseBeginDateTime, d.begin) !== 1,
      )
      .filter(
        (d) =>
          Temporal.PlainDateTime.compare(
            untilDate,
            Temporal.PlainDate.from(d.end),
          ) !== -1,
      );
    event.dates.forEach((d) => {
      d.begin = d.begin.toString() + "Z";
      d.end = d.end.toString() + "Z";
      d.noted = false;
    });
    for (const d in store.value.advance) {
      const i = Object.keys(store.value.advance).indexOf(d);
      console.log(i);
      if (notificationSelected[i]) {
        event.notification.advance.push(store.value.advance[d][1]);
      }
    }
    console.log(event);
    return fetch(`${store.value.url}:${store.value.port}/event`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static insertNMonthly(
    n,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      dates: [],
      title: eventTitle,
      details: {
        text: eventText,
        link: eventLink,
      },
    };
    const baseBeginDateTime = Temporal.PlainDateTime.from(
      `${eventBeginDate}T${eventBeginTime}:00.000`,
    );
    const baseEndDateTime = Temporal.PlainDateTime.from(
      `${eventEndDate}T${eventEndTime}:00.000`,
    );
    for (let i = 0; i < n; i++) {
      event.dates.push({
        begin: baseBeginDateTime.add({ months: i }).toString() + "Z",
        end: baseEndDateTime.add({ months: i }).toString() + "Z",
        noted: false
      });
    }
    for (const d in store.value.advance) {
      const i = Object.keys(store.value.advance).indexOf(d);
      console.log(i);
      if (notificationSelected[i]) {
        event.notification.advance.push(store.value.advance[d][1]);
      }
    }
    console.log(event);
    return fetch(`${store.value.url}:${store.value.port}/event`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
  static insertUntilMonthly(
    untilDate,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      dates: [],
      title: eventTitle,
      details: {
        text: eventText,
        link: eventLink,
      },
    };
    const baseBeginDateTime = Temporal.PlainDateTime.from(
      `${eventBeginDate}T${eventBeginTime}:00.000`,
    );
    const baseEndDateTime = Temporal.PlainDateTime.from(
      `${eventEndDate}T${eventEndTime}:00.000`,
    );
    let i = 0;
    do {
      event.dates.push({
        begin: baseBeginDateTime.add({ months: i }).toString() + "Z",
        end: baseEndDateTime.add({ months: i }).toString() + "Z",
        noted: false
      });
      i++;
    } while (
      Temporal.PlainDate.compare(
        Temporal.PlainDate.from(eventEndDate).add({ months: i }),
        Temporal.PlainDate.from(untilDate),
      ) !== 1
    );
    for (const d in store.value.advance) {
      const i = Object.keys(store.value.advance).indexOf(d);
      console.log(i);
      if (notificationSelected[i]) {
        event.notification.advance.push(store.value.advance[d][1]);
      }
    }
    console.log(event);
    return fetch(`${store.value.url}:${store.value.port}/event`, {
      method: "POST",
      credentials: "include",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
}

export { EventCreator };
