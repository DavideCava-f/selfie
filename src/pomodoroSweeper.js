import { store } from "@/store";
import { Temporal } from "@js-temporal/polyfill";

async function sweepPomodoros() {
  // Da store.pomodoros prende tutti i pomodori fetchati;
  // Di questi si considera quelli da ieri a -infinito non completati;
  // Li completa (taggandoli per evitare il doppio sweep) e crea nuovi pomodori
  // dei cicli rimanenti a oggi;
  let pomodorosToSweep = store.value.pomodoros.filter((pomodoro) => {
    if (pomodoro.beginDate) {
      const finishPomodoroDateTime = Temporal.PlainDateTime.from(pomodoro.beginDate.slice(0, -1)).add({ minutes: (pomodoro.studyMins + pomodoro.pauseMins) * pomodoro.cycles });

      const cond = pomodoro.completedCycles < pomodoro.cycles &&
        Temporal.PlainDate.compare(store.value.simDate, finishPomodoroDateTime.toPlainDate()) > 0;
      return cond;
    } else {
      return false;
    }
  }).map(pomodoro => ({ ...pomodoro }));

  await fetch(`${store.value.url}:${store.value.port}/pomodoro/sweep`, {
    credentials: "include",
    method: "PUT",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ids: pomodorosToSweep.map((pomodoro) => pomodoro._id)
    })
  });

  pomodorosToSweep.forEach((pomodoro) => {
    const pdate = Temporal.PlainDateTime.from(pomodoro.beginDate.slice(0, -1));
    pomodoro.beginDate = store.value.simDate.toPlainDateTime({
      hour: pdate.hour,
      minute: pdate.minute,
      second: pdate.second,
      millisecond: 0,
      microsecond: 0,
      nanosecond: 0,
    })
    pomodoro.cycles -= pomodoro.completedCycles;
    pomodoro.completedCycles = 0;
  });

  const promiseCreation = pomodorosToSweep.map((pomodoro) => {
    return fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
      credentials: "include",
      method: "POST",
      headers: {
        Accept: "application/json",
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        beginDate: pomodoro.beginDate.toString() + ".000Z",
        cycles: pomodoro.cycles,
        studyMins: pomodoro.studyMins,
        pauseMins: pomodoro.pauseMins,
        completedCycles: pomodoro.completedCycles
      })
    })
  });

  await Promise.all(promiseCreation);

  if (promiseCreation.length > 0) {
    const response = await fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
      credentials: "include"
    });
    store.value.pomodoros = (await response.json());
  }
}

export { sweepPomodoros };
