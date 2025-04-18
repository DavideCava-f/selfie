import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Temporal } from "@js-temporal/polyfill";


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

async function EventNotification(event) {
  let Now = (Temporal.PlainDateTime.from(store.value.simDateTime));
  let untilAck = event.notification.untilAck;
  let dates = event.dates;
  // FIXME: siamo sicuri che con find venga trovata la prima data dell'evento da notificare?
  let nextDate = dates.find(date => Temporal.PlainDateTime.compare(Temporal.PlainDateTime.from(date.begin.slice(0, -1)), Now) >= 1) //Trovo la data successiva e dopo faccio i controlli

  if (nextDate != undefined) {
    event.notification.advance.forEach(advance => {
      let BeginDate = (Temporal.PlainDateTime.from((nextDate.begin.toString()).slice(0, -1)));
      let distance = BeginDate.since(Now, { smallestUnit: "seconds", largestUnit: "months" });

      if (distance.total({ unit: 'days' }) < 1 && advance.ofType === ("oneDay") && !advance.noted) {
        console.log(event);
        let not = "\"" + event.title + "\" is happening in less than a day!"
        toast(not, {
          "theme": "auto",
          "type": "default",
          "position": "top-left",
          "transition": "slide", 
          "autoClose": untilAck ? false : 5000,
          "dangerouslyHTMLString": true
        });
        setNotedTrue(event._id, advance._id);
      } else if (distance.total({ unit: 'days' }) < 7 && advance.ofType === ("oneWeek") && !advance.noted) {
        console.log(event);
        let not = "\"" + event.title + "\" is happening in less than a week!"
        toast(not, {
          "theme": "auto",
          "type": "default",
          "position": "top-left",
          "transition": "slide",
          "autoClose": untilAck ? false : 5000,
          "dangerouslyHTMLString": true
        });
        setNotedTrue(event._id, advance._id);
      }
    })
  } else {
    // FIXME: ma questo caso non dovrebbe mai esserci, poiche' la query
    // nearEvents esclude eventi che non hanno date il cui inizio e' maggiore di oggi
  }
}


async function notipol() {
  const max = (store.value.advance.days.twoWeeks[0].add(store.value.advance.hours.twelveHr[0].add(store.value.advance.minutes.halfHr[0]))).toString();
  //console.log("max: " + max.toString());
  let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${true}&max=${max}`);
  let Events = await response.json();
  console.log("notipol!");
  console.log(Events);
  await Events.forEach(el => { EventNotification(el) });
}

export { notipol };
