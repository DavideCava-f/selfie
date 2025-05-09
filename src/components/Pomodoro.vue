<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { store } from "@/store";

var SetMinutes = ref(35)
var SetCycles = ref(5)
var relaxingMinutes = ref(0)
var TotalTime = ref(5)
var relaxingTime = computed(() => { return relaxingMinutes.value * 60 })
var relaxing = ref(false);
const INITIAL_TIME = computed(() => { return relaxing.value ? relaxingTime.value : SetMinutes.value * 60 }); // 25 minutes in seconds
const time = ref(0);
var cycles = ref(0)
const isRunning = ref(false);
let timerId = null;
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
  time.value = INITIAL_TIME.value
  cycles.value = SetCycles.value
}
function tick() {
  if (time.value > 0) {
    time.value--;
  } else {
    if (cycles.value > 1) {
      if (!relaxing.value) {
        time.value = relaxingTime.value
        //pauseTimer()
        relaxing.value = true
      } else {
        AdvanceCycle();
      }
    } else {

      cycles.value--
      pauseTimer();
      alert('Time is up!');
    }
  }
}
function forceCycle() {
  time.value = 0
}
function startTimer() {
  if (isRunning.value) return;
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
  //  pauseTimer();
  time.value = INITIAL_TIME.value;
}

function resetTimerCycle() {
  pauseTimer();
  relaxing.value = false
  time.value = INITIAL_TIME.value;
  cycles.value = SetCycles.value;
}

function findFactors(tot) {
  let iter = Math.floor(tot / 2)
  let divis = []
  while (iter > 0) {

    if ((tot % iter) == 0) {
      divis.push(iter)
    }

    iter -= 1

  }
  return divis

}

function CalcTime() {
  let totalTime = TotalTime.value
  let divis = findFactors(totalTime)

  let time = divis[Math.floor(Math.random() * divis.length)]
  let cycles = totalTime / time
  if (cycles > time) { //SWAP var
    time = time + cycles
    cycles = time - cycles
    time = time - cycles
  }
  let work = Math.floor(time * 4 / 5)
  let relax = Math.ceil(time / 5)

  if (cycles == 1) {
    SetMinutes.value = time
  } else {

    SetMinutes.value = work
    relaxingMinutes.value = relax
  }
  SetCycles.value = cycles


}

function createPomodoroEvent() {
  fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
    credentials: "include",
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      beginDate: startDate.value + "T" + startTime.value + ":00.000Z",
      cycles: SetCycles.value,
      studyMins: SetMinutes.value,
      pauseMins: relaxingMinutes.value,
    })
  }).then(() => { console.log("pomodoro created correctly"); store.value.update(); });
}

onUnmounted(() => {
  if (timerId !== null) {
    clearInterval(timerId);
  }
});
</script>
<template>
  <!--  <div class="container modal-content">
        <div class="modal-body">

      <div class="brand">Pomodoro Timer</div>
      <div class="timer">{{ formatTime }}</div>
      <div class="progress-bar">
        <div class="progress" :style="{ width: progressBarWidth }"></div>
      </div>
      <button @click="startTimer" :disabled="isRunning">Start</button>
      <button @click="pauseTimer" :disabled="!isRunning" class="pause-button">Pause</button>
      <button @click="resetTimer" class="reset-button">Reset</button>

        </div>
    </div>-->
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">Pomodoro Timer</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <div class="container modal-content">
          <div class="modal-body">
            <div v-if="store.activePomodoro">
              <button @click="store.activePomodoro = null" class="btn" style="">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                  class="bi bi-link-45deg" viewBox="0 0 16 16">
                  <path
                    d="M4.715 6.542 3.343 7.914a3 3 0 1 0 4.243 4.243l1.828-1.829A3 3 0 0 0 8.586 5.5L8 6.086a1 1 0 0 0-.154.199 2 2 0 0 1 .861 3.337L6.88 11.45a2 2 0 1 1-2.83-2.83l.793-.792a4 4 0 0 1-.128-1.287z" />
                  <path
                    d="M6.586 4.672A3 3 0 0 0 7.414 9.5l.775-.776a2 2 0 0 1-.896-3.346L9.12 3.55a2 2 0 1 1 2.83 2.83l-.793.792c.112.42.155.855.128 1.287l1.372-1.372a3 3 0 1 0-4.243-4.243z" />
                </svg>
              </button>
              <span>
                <i>Linked to pomodoro at {{ store.activePomodoro.beginDate.split("T")[0] }} -
                  {{ store.activePomodoro.beginDate.split("T")[1].slice(0, 5) }}</i>
              </span>
            </div>

            <div class="brand">Pomodoro Timer</div>
            <div>
              <div>
                <input v-model="TotalTime" type="number" />
                <button @click="CalcTime">DIOSTRONZO</button>
                <label>
                  Minutes
                  <input v-model="SetMinutes" />
                </label>
                <label>
                  Cycles
                  <select v-model="SetCycles">
                    <option v-for="n in 500" :key="n" :value="n">{{ n }}</option>
                  </select>
                </label>

              </div>
              <div>

                <label>
                  RelaxingMinutes
                  <input v-model="relaxingMinutes" />
                </label>
              </div>
            </div>

            <div class="btn-group " role="group" aria-label="Basic radio toggle button group">
              <button type="button" class="btn btn-outline-primary active" @click="mode = 0">
                Now
              </button>
              <button type="button" class="btn btn-outline-primary" @click="mode = 1">
                Plan
              </button>
            </div>

            <div v-if="mode === 0">
              <button @click="setupTimer()"> Set</button>

              <div v-if="cycles">Cycles: {{ cycles }}</div>
              <div :class="{ timerWork: !relaxing, timerRelaxing: relaxing }">{{ formatTime }}</div>
              <div class="progress-bar">
                <div class="progress" :style="{ width: progressBarWidth }"></div>
              </div>
              <button @click="startTimer" :disabled="isRunning">Start</button>
              <button @click="pauseTimer" :disabled="!isRunning" class="pause-button">Pause</button>
              <button @click="resetTimerCycle" class="reset-button">Reset</button>
              <button @click="forceCycle" :disabled="!isRunning" class="pause-button">forceCycle</button>
            </div>
            <div v-else>
              <input class="form-control" type="date" v-model="startDate" />
              <input class="form-control" type="time" v-model="startTime" />
              <button @click="createPomodoroEvent()">Create</button>
            </div>

          </div>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
          Reset
        </button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
          Change
        </button>
      </div>
    </div>
  </div>
</template>
<style scoped>
.container {
  text-align: center;
  border: 2px solid #4caf50;
  border-radius: 20px;
  padding: 20px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  max-width: 400px;
  margin: auto;
}

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
