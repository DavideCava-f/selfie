class EventCreator {
  static insertNDaily(
    n,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginHourMinSec,
    eventEndDate,
    eventEndHourMinSec,
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
    for (let i = 0; i < n; i++) {
      const baseBeginTime = `${eventBeginDate}T${eventBeginHourMinSec}:00.000Z`;
      const baseEndTime = `${eventEndDate}T${eventEndHourMinSec}:00.000Z`;
      event.dates.push({
        begin: new Date(Date.parse(baseBeginTime) + i * 86400000).toISOString(),
        end: new Date(Date.parse(baseEndTime) + i * 86400000).toISOString(),
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
    eventBeginHourMinSec,
    eventEndDate,
    eventEndHourMinSec,
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
    let i = 0;
    do {
      const baseBeginTime = `${eventBeginDate}T${eventBeginHourMinSec}:00.000Z`;
      const baseEndTime = `${eventEndDate}T${eventEndHourMinSec}:00.000Z`;
      event.dates.push({
        begin: new Date(Date.parse(baseBeginTime) + i * 86400000).toISOString(),
        end: new Date(Date.parse(baseEndTime) + i * 86400000).toISOString(),
      });
      i++;
    } while (Date.parse(eventEndDate) + i * 86400000 < Date.parse(untilDate));
  }
  static insertNMonthly(
    n,
    userEmail,
    eventTitle,
    eventText,
    eventLink,
    eventBeginDate,
    eventBeginHourMinSec,
    eventEndDate,
    eventEndHourMinSec,
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
    for (let i = 0; i < n; i++) {
      const baseBeginTime = `${eventBeginDate}T${eventBeginHourMinSec}:00.000Z`;
      const baseEndTime = `${eventEndDate}T${eventEndHourMinSec}:00.000Z`;
      event.dates.push({
        begin: new Date(
          Date.parse(baseBeginTime) + i * 2629800000,
        ).toISOString(),
        end: new Date(Date.parse(baseEndTime) + i * 2629800000).toISOString(),
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
    eventBeginHourMinSec,
    eventEndDate,
    eventEndHourMinSec,
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
    let i = 0;
    do {
      const baseBeginTime = `${eventBeginDate}T${eventBeginHourMinSec}:00.000Z`;
      const baseEndTime = `${eventEndDate}T${eventEndHourMinSec}:00.000Z`;
      event.dates.push({
        begin: new Date(
          Date.parse(baseBeginTime) + i * 2629800000,
        ).toISOString(),
        end: new Date(Date.parse(baseEndTime) + i * 2629800000).toISOString(),
      });
      i++;
    } while (Date.parse(eventEndDate) + i * 2629800000 < Date.parse(untilDate));
  }
}
