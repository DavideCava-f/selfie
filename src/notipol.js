import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Temporal } from "@js-temporal/polyfill";


async function setNotedTrue(eventId) {
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
      SetNoted: true
    }),
  })
}

async function EventNotification(event) {
  let Now = (Temporal.PlainDateTime.from(store.value.simDateTime));
  /* per ragioni di test cambio l'untilAck */
  event.notification.untilAck = false;
  let untilAck = event.notification.untilAck;
  let dates = event.dates;
  console.log("Dates: ", dates);
  /* per ragioni di test adesso cambio l'advance di ogni evento*/
  event.notification.advance.push({ type: "oneDay", noted: false });
  event.notification.advance.push({ type: "oneWeek", noted: false });
  console.log("Advance: ", event.notification.advance);
  // FIXME: siamo sicuri che con find venga trovata la prima data dell'evento da notificare?
  let nextDate = dates.find(date => Temporal.PlainDateTime.compare(Temporal.PlainDateTime.from(date.begin.slice(0, -1)), Now) >= 1) //Trovo la data successiva e dopo faccio i controlli

  if (nextDate != undefined) {
    event.notification.advance.forEach(advance => {
      let BeginDate = (Temporal.PlainDateTime.from((nextDate.begin.toString()).slice(0, -1)));
      let distance = BeginDate.since(Now, { smallestUnit: "seconds", largestUnit: "months" });

      if (distance.total({ unit: 'days' }) < 1 && advance.type === ("oneDay") && !advance.noted) {
        let not = "\"" + event.title + "\" is happening in one day!"
        toast(not, {
          "theme": "auto",
          "type": "default",
          "position": "top-left",
          "transition": "slide",
          "autoClose": untilAck ? false : 5000,
          "dangerouslyHTMLString": true
        });
      } else if (distance.total({ unit: 'days' }) < 7 && advance.type === ("oneWeek") && !advance.noted) {
        let not = "\"" + event.title + "\" is happening in one week!"
        toast(not, {
          "theme": "auto",
          "type": "default",
          "position": "top-left",
          "transition": "slide",
          "autoClose": untilAck ? false : 5000,
          "dangerouslyHTMLString": true
        });
      }

      // setNotedTrue(event._id, advance._id)
    })
  } else {
    // FIXME: ma questo caso non dovrebbe mai esserci, poiche' la query
    // nearEvents esclude eventi che non hanno date il cui inizio e' maggiore di oggi
  }
}


async function notipol() {
  let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${true}&max=${store.value.advance[-1]}`);
  let Events = await response.json();
  //console.log("Events: ", Events);
  console.log("notipol!");
  await Events.forEach(el => { EventNotification(el) });
  // Assumiamo di avere l'array delle notifiche da mostrare in response
}

export { notipol };
