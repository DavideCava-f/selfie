import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";

class EventCreator {
  static insertNDaily(
    n,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      UserEmail: userEmail,
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
        begin: baseBeginDateTime.add({ days: i }),
        end: baseEndDateTime.add({ days: i }),
      });
    }
    console.log(event);
    fetch("http://localhost:8000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => console.log("t'apposto"));
  }
  static insertUntilDaily(
    untilDate,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      UserEmail: userEmail,
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
        begin: baseBeginDateTime.add({ days: i }),
        end: baseEndDateTime.add({ days: i }),
      });
      i++;
    } while (
      Temporal.PlainDate.compare(
        Temporal.PlainDate.from(eventEndDate).add({ days: i }),
        Temporal.PlainDate.from(untilDate),
      ) !== 1
    );
    console.log(event);
    fetch("http://localhost:8000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => console.log("t'apposto"));
  }
  static insertNWeekly(
    n,
    weekDays,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      UserEmail: userEmail,
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
    console.log(weekDaysOn);
    // Devo:
    // 1. vedere il giorno di baseBeginDateTime
    // 2. far partire il baseBeginDateTime al primo giorno in weekDaysOn successivo al giorno corrente
    const baseWeekDay = baseBeginDateTime.dayOfWeek - 1;
    const firstValidWeekDay = weekDaysOn.find((d) => d >= baseWeekDay);
    baseBeginDateTime.add({ days: firstValidWeekDay - baseWeekDay });
    baseEndDateTime.add({ days: firstValidWeekDay - baseWeekDay });
    console.log(baseWeekDay);
    console.log(firstValidWeekDay);
    for (let i = 0; i < n; i++) {
      // FIXME:
      weekDaysOn.forEach((day) => {
        event.dates.push({
          begin: baseBeginDateTime.add({ weeks: i }),
          end: baseEndDateTime.add({ weeks: i }),
        });
      });
    }
  }
  static insertNMonthly(
    n,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      UserEmail: userEmail,
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
        begin: baseBeginDateTime.add({ months: i }),
        end: baseEndDateTime.add({ months: i }),
      });
    }
    console.log(event);
    fetch("http://localhost:8000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => console.log("t'apposto"));
  }
  static insertUntilMonthly(
    untilDate,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginTime,
    eventEndDate,
    eventEndTime,
  ) {
    const event = {
      UserEmail: userEmail,
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
        begin: baseBeginDateTime.add({ months: i }),
        end: baseEndDateTime.add({ months: i }),
      });
      i++;
    } while (
      Temporal.PlainDate.compare(
        Temporal.PlainDate.from(eventEndDate).add({ months: i }),
        Temporal.PlainDate.from(untilDate),
      ) !== 1
    );
    console.log(event);
    fetch("http://localhost:8000/events", {
      method: "POST",
      body: JSON.stringify(event),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => console.log("t'apposto"));
  }
}

export { EventCreator };
