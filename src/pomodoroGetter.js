import { store } from "@/store";
import { sweepPomodoros } from "@/pomodoroSweeper";

async function getPomodoros() {
  const response = await fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
    credentials: "include"
  });
  store.value.pomodoros = (await response.json());
  /* console.log("Pomodoros:");
  console.log(store.value.pomodoros); */
  await sweepPomodoros();
}

export { getPomodoros };
