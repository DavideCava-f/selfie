import { store } from "@/store";
import { toast } from "vue3-toastify";
import "vue3-toastify/dist/index.css";
import { Temporal } from "@js-temporal/polyfill";
import router from "./router/Router";
import { ref } from "vue";
import SnoozeToast from "@/components/SnoozeToast.vue";

let msg = ref(null);
let notificationMessage = ref(null);

async function setNotedTrue(eventId, dateId) {
  await fetch(`${store.value.url}:${store.value.port}/notification`, {
    method: "put",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Event: eventId,
      id_Date: dateId,
      setNoted: true
    }),
  })
}

function openDate(date) {
  router.push("/calendar");
  let begin = Temporal.PlainDateTime.from(date.begin.slice(0, -1));
  let distance = begin.since(store.value.simDateTime, { smallestUnit: "seconds", largestUnit: "months" });


  store.value.dayOffset += Math.round(distance.total({ unit: 'days' }));
  store.value.weekOffset += Math.round(distance.total({ unit: 'weeks', relativeTo: store.value.simDateTime }));
  store.value.monthOffset += Math.round(distance.total({ unit: 'months', relativeTo: store.value.simDateTime }));
}

function showToast(untilAck, notificationMessage, style) {
  const scheduleReshow = () => {
    // schedule the next one in 5 minutes (300 000 ms)
    setTimeout(() => {
      showToast(untilAck, notificationMessage, style);
    }, 5 * 60 * 1000)
  }

  toast(SnoozeToast, {
    theme: "auto",
    type: "default",
    position: "top-left",
    transition: "slide",
    autoClose: untilAck ? false : 5000,
    expandCustomProps: true,
    style: style,
    contentProps: {
      message: notificationMessage,
      onReshow: scheduleReshow
    },
  });
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
          !nextDate.noted &&
          Temporal.Duration.compare(distance, duration) <= 0) {
          const notificationMessage = `"${event.title}" is happening in less than ${type}!`;
          showToast(untilAck, notificationMessage, {});
          const notification = new Notification(notificationMessage);
          setNotedTrue(event._id, nextDate._id);
        }
      }
    }
    );
  } else {
    // FIXME: ma questo caso non dovrebbe mai esserci, poiche' la query
    // nearEvents esclude eventi che non hanno date il cui inizio e' maggiore di oggi
  }
}

async function ActivityNotification(act) {

  let isModified = false
  let deadline = Temporal.PlainDateTime.from(act.dates[0].deadline.slice(0, -1))
  let now = Temporal.PlainDateTime.from(store.value.simDateTime)
  if (act.notification.oneWeekLate == false) {

    if (Temporal.PlainDateTime.compare(deadline.add({ weeks: 1 }), now) <= 0) {

      notificationMessage.value = `"${act.title}" is One Week`;
      showToast(false, notificationMessage, {
        backgroundColor: '#000000', // red 
        color: '#333',              // dark text for contrast
        border: '2px solid rgb(255, 0, 0)',
        fontWeight: 'bold',
      });
      //Tostami
      act.notification.oneWeekLate = true
      act.notification.oneDayLate = true
      act.notification.isLate = true
      isModified = true
    }
  } if (act.notification.oneDayLate == false) {
    if (Temporal.PlainDateTime.compare(deadline.add({ days: 1 }), now) <= 0) {
      notificationMessage.value = `"${act.title}" is One Day Late`;
      showToast(false, notificationMessage, {
        backgroundColor: '#000000', // orange 
        color: '#333',              // dark text for contrast
        border: '2px solid rgb(255, 251, 0)',
        fontWeight: 'bold',
      });
      //Tostami
      act.notification.oneDayLate = true
      act.notification.isLate = true
      isModified = true
    }
  } if (act.notification.isLate == false) { //Se arrivto qui significa scaduto non servono ulteriori controlli
    notificationMessage.value = `"${act.title}" is Expired!`;
    showToast(false, notificationMessage, {
      backgroundColor: '#000000', // soft yellow
      color: '#FFF',              // dark text for contrast
      border: '2px solid rgb(25, 0, 255)',
      fontWeight: 'bold',
    });
    //TOSTAMI
    //Metti il noti
    act.notification.isLate = true
    isModified = true
  }


  if (isModified) { //Altrimenti non ce bisogno di fetch
    await fetch(`${store.value.url}:${store.value.port}/activity/noted`, {
      method: "put",
      credentials: "include",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_Act: act._id,
        isLateModified: act.notification.isLate,
        oneDayModified: act.notification.oneDayLate,
        oneWeekModified: act.notification.oneWeekLate

      }),
    }
    );

  }
}

async function notipol() {
  if (await store.value.checkAuth()) {
    Notification.requestPermission();
    const max = (store.value.advance.twoWeeks[0].add(store.value.advance.twelveHr[0].add(store.value.advance.halfHr[0]))).toString();
    let response = await fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${true}&max=${max}`, {
      credentials: "include"
    });
    let Events = await response.json();
    let now = Temporal.PlainDateTime.from(store.value.simDateTime)
    await Events.forEach(el => { EventNotification(el) });
    let activities = await fetch(`${store.value.url}:${store.value.port}/activity`, {
      credentials: "include"
    });
    let Acts = await activities.json();
    let toReturn = false
    let Expired = Acts.filter((el) => {
      if (!el.dates[0].deadline) {
        toReturn = false;
      } else {

        let deadline = Temporal.PlainDateTime.from(el.dates[0].deadline.slice(0, -1))
        toReturn = el.completed == false && Temporal.PlainDateTime.compare(deadline, now) < 0;
      }
      return toReturn
    })
    /*
      const oneDayFromNow = now.add({ days: 1 });
      const oneWeekFromNow = now.add({ days: 7 });
  
     */
    Expired.forEach((el) => {
      ActivityNotification(el)
    })
  }
}

export { notipol, openDate };
