import { store } from "@/store";

async function getPomodoros() {
  const response = await fetch(`${store.value.url}:${store.value.port}/pomodoro`);
  store.value.pomodoros = (await response.json());
  console.log("Pomodoros:");
  console.log(store.value.pomodoros);
}

export { getPomodoros };
