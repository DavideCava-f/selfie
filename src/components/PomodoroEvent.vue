<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { store } from "@/store";

const DEFAULT_STUDY_MINS = 30;
const DEFAULT_PAUSE_MINS = 5;
const DEFAULT_CYCLES = 5;

var SetMinutes = ref(DEFAULT_STUDY_MINS)
var SetCycles = ref(DEFAULT_CYCLES)
var relaxingMinutes = ref(DEFAULT_PAUSE_MINS)

var TotalTime = ref(1)
var relaxingTime = computed(() => { return relaxingMinutes.value * 60 })
var relaxing = ref(false);
const INITIAL_TIME = computed(() => { return relaxing.value ? relaxingTime.value : SetMinutes.value * 60 });
const time = ref(0);
var cycles = ref(0);
const isRunning = ref(false);
let timerId = null;
const isSet = ref(false);

var mode = ref(0);
var startDate = ref(null);
var startTime = ref(null);

const formatTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});

const progressBarWidth = computed(() => {
  return `${(time.value / INITIAL_TIME.value) * 100}%`;
});

function setupTimer() {
  pauseTimer();
  relaxing.value = false
  time.value = INITIAL_TIME.value
  cycles.value = SetCycles.value - store.value.activePomodoro.completedCycles;
  isSet.value = true;
}

async function tick() {
  if (time.value > 0) {
    time.value--;
  } else {
    if (cycles.value > 1) {
      if (!relaxing.value) {
        time.value = relaxingTime.value
        relaxing.value = true
        if (store.value.activePomodoro) await updateCompletedCycles();
      } else {
        AdvanceCycle();
      }
    } else {
      cycles.value = 0;
      pauseTimer();
      alert('Time is up!');
    }
  }
}

function forceCycle() {
  time.value = 0
}

function startTimer() {
  isRunning.value = true;
  timerId = setInterval(tick, 1000);
}

function pauseTimer() {
  if (timerId !== null) {
    clearInterval(timerId);
    timerId = null;
  }
  isRunning.value = false;
}

function AdvanceCycle() {
  relaxing.value = false
  cycles.value--;
  time.value = INITIAL_TIME.value;
}

async function resetTimerCycle() {
  pauseTimer();
  await resetCycles();
  SetCycles.value = store.value.activePomodoro.cycles;
  relaxing.value = false
  time.value = INITIAL_TIME.value;
  cycles.value = SetCycles.value;
  isSet.value = false;
}


function deletePomodoroEvent() {
  console.log("delete pomodoro");
  fetch(`${store.value.url}:${store.value.port}/pomodoro?id=${store.value.activePomodoro._id}`, {
    credentials: "include",
    method: "DELETE",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    }
  }).then(() => {
    console.log("pomodoro deleted correctly");
    store.value.activePomodoro = null;
    store.value.update();
  });
}

function updateCompletedCycles() {
  fetch(`${store.value.url}:${store.value.port}/pomodoro?id=${store.value.activePomodoro._id}`, {
    credentials: "include",
    method: "PUT",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
  }).then(() => {
    console.log("pomodoro updated correctly");
    store.value.update();
  })
}

function resetCycles() {
  fetch(`${store.value.url}:${store.value.port}/pomodoro/reset?id=${store.value.activePomodoro._id}`, {
    credentials: "include",
    method: "PUT",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
  }).then(() => {
    console.log("pomodoro resetted correctly");
    store.value.update();
  })
}

watch(() => store.value.activePomodoro?._id, () => {
  if (store.value.activePomodoro) {
    SetMinutes.value = store.value.activePomodoro.studyMins;
    SetCycles.value = store.value.activePomodoro.cycles;
    relaxingMinutes.value = store.value.activePomodoro.pauseMins;
  }
  time.value = 0;
  cycles.value = 0;
  isSet.value = false;
  relaxing.value = false;
  pauseTimer();
});

</script>

<template>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">Pomodoro Timer</h1>
        <button @click="() => { !isRunning && !store.activePomodoro ? reset() : null; }" type="button" class="btn-close"
          data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column text-center">
        <button @click="deletePomodoroEvent(); isSet = false" class="btn btn-danger" data-bs-dismiss="modal">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash"
            viewBox="0 0 16 16">
            <path
              d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
            <path
              d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
          </svg>
        </button>
        <span>
          <i>Linked to pomodoro at {{ store.activePomodoro?.beginDate.split("T")[0] }} -
            {{ store.activePomodoro?.beginDate.split("T")[1].slice(0, 5) }}</i>
        </span>

        <div class="brand">Pomodoro Timer</div>

        <div class="d-flex justify-content-between">
          <label>
            Studying Minutes: {{ SetMinutes }}
          </label>
          <label>
            Cycles: {{ SetCycles }}
          </label>
          <label>
            Relaxing Minutes: {{ relaxingMinutes }}
          </label>
        </div>

        <div class="d-flex justify-content-center">
          <button @click="setupTimer" :disabled="isSet">Set</button>
          <button @click="resetTimerCycle" :disabled="isRunning" class="reset-button">Reset</button>
        </div>
        <div v-if="cycles">
          Remaining cycles: {{ cycles }}
        </div>
        <div :class="{ timerWork: !relaxing, timerRelaxing: relaxing }">{{ formatTime }}</div>
        <div class="progress-bar">
          <div class="progress" :style="{ width: progressBarWidth }"></div>
        </div>
        <button @click="startTimer" :disabled="isRunning || !isSet">Start</button>
        <button @click="pauseTimer" :disabled="!isRunning" class="pause-button">Pause</button>
        <button @click="forceCycle" :disabled="!isRunning" class="pause-button">Next</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.brand {
  font-size: 2rem;
  color: #4caf50;
  margin-bottom: 10px;
}

.timerWork {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #ff0000;
}

.timerRelaxing {
  font-size: 4rem;
  margin-bottom: 20px;
  color: #00ff0d;
}

.progress-bar {
  width: 70%;
  background-color: #ddd;
  border-radius: 20px;
  overflow: hidden;
  margin: 0 auto 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.progress {
  background-color: #4caf50;
  height: 20px;
  border-radius: 20px;
  transition: width 0.5s ease-in-out;
}

button {
  font-size: 1.5rem;
  padding: 10px 20px;
  margin: 5px;
  border: none;
  background-color: #4caf50;
  color: #fff;
  cursor: pointer;
  border-radius: 5px;
  transition: background-color 0.3s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

button:hover:not(:disabled) {
  background-color: #45a049;
}

.reset-button {
  background-color: #ff5252;
}

.reset-button:hover:not(:disabled) {
  background-color: #e04848;
}

.pause-button {
  background-color: #ffd600;
  color: #000;
}

.pause-button:hover:not(:disabled) {
  background-color: #e6c200;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
