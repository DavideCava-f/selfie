import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Temporal } from "@js-temporal/polyfill";
import router from "./router/Router";

async function setNotedTrue(eventId, advanceId) {
  fetch(`${store.value.url}:${store.value.port}/notification`, {
    method: "put",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Event: eventId,
      id_Advance: advanceId,
      setNoted: true
    }),
  })
}

function openDate(date) {
  router.push("/calendar");
  console.log(date);
  let begin = Temporal.PlainDateTime.from(date.begin.slice(0, -1));
  console.log(begin);
  let distance = begin.since(store.value.simDateTime, { smallestUnit: "seconds", largestUnit: "months" });

  console.log(distance.total({ unit: 'days' }));
  console.log(distance.total({ unit: 'weeks', relativeTo: store.value.simDateTime }));
  console.log(distance.total({ unit: 'months', relativeTo: store.value.simDateTime }));

  store.value.dayOffset += Math.round(distance.total({ unit: 'days' }));
  store.value.weekOffset += Math.round(distance.total({ unit: 'weeks', relativeTo: store.value.simDateTime }));
  store.value.monthOffset += Math.round(distance.total({ unit: 'months', relativeTo: store.value.simDateTime }));
}

async function EventNotification(event) {
  let Now = Temporal.PlainDateTime.from(store.value.simDateTime);
  let untilAck = event.notification.untilAck;
  let dates = event.dates;
  // FIXME: siamo sicuri che con find venga trovata la prima data dell'evento da notificare?
  let nextDate = dates.find(date => Temporal.PlainDateTime.compare(Temporal.PlainDateTime.from(date.begin.slice(0, -1)), Now) >= 1) //Trovo la data successiva e dopo faccio i controlli

  if (nextDate != undefined) {
    event.notification.advance.forEach(advance => {
      for (const d in store.value.advance) {
        const duration = store.value.advance[d][0];
        const type = store.value.advance[d][1];
        const distance = Temporal.PlainDateTime.from(nextDate.begin.toString().slice(0, -1)).since(Now);
        if (advance.ofType === type &&
          !advance.noted &&
          Temporal.Duration.compare(distance, duration) <= 0) {
          const notificationMessage = `"${event.title}" is happening in less than ${type}!`;
          toast(notificationMessage, {
            theme: "auto",
            type: "default",
            position: "top-left",
            transition: "slide",
            autoClose: untilAck ? false : 5000,
            onClick: () => openDate(nextDate),
            dangerouslyHTMLString: true,
          });
          setNotedTrue(event._id, advance._id);
        }
      }
    }
    );
  } else {
    // FIXME: ma questo caso non dovrebbe mai esserci, poiche' la query
    // nearEvents esclude eventi che non hanno date il cui inizio e' maggiore di oggi
  }
}


async function notipol() {
  const max = (store.value.advance.twoWeeks[0].add(store.value.advance.twelveHr[0].add(store.value.advance.halfHr[0]))).toString();
  //console.log("max: " + max.toString());
  let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${true}&max=${max}`);
  let Events = await response.json();
  console.log("notipol!");
  console.log(Events);
  await Events.forEach(el => { EventNotification(el) });
}

export { notipol };
