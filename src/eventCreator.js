import { Temporal } from "@js-temporal/polyfill";

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
