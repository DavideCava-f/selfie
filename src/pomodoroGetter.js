import { store } from "@/store";
import { sweepPomodoros } from "@/pomodoroSweeper";

async function getPomodoros() {
  console.log("GET POMODOROs");
  const response = await fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
    credentials: "include"
  });
  store.value.pomodoros = (await response.json());

  await sweepPomodoros();
}

export { getPomodoros };
