<script setup>
import { ref, computed, onUnmounted } from 'vue';
import { store } from "@/store";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import DateTimePicker from './DateTimePicker.vue';

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
var barTime = ref(1) //Non prendo direttamente dal set altrimenti la barra si sballa
const time = ref(0);
var cycles = ref(0);
const isRunning = ref(false);
let timerId = null;
const isSet = ref(false);

var mode = ref(0);
var startDate = ref(store.value.simDate);
var startTime = ref(store.value.simTime.slice(0, 5) + ":00");
let lancetta = ref(null);
let pomodoro = ref(null);
let RateOfChange = ref();
let colorValue = ref();
let relaxChange = ref();

const formatTime = computed(() => {
  const minutes = Math.floor(time.value / 60);
  const seconds = time.value % 60;
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
});


function setupTimer() {
  if ((SetMinutes.value < 1 || !(/^-?[\d.]+(?:e-?\d+)?$/.test(SetMinutes.value))) || (SetCycles.value < 1 || !(/^-?[\d.]+(?:e-?\d+)?$/.test(SetCycles.value))) || (relaxingMinutes.value < 0 || !(/^-?[\d.]+(?:e-?\d+)?$/.test(relaxingMinutes.value)))) {
    alert("Please set valid values for minutes, cycles, and relaxing minutes.");
    return;
  }
  pauseTimer();
  relaxing.value = false
  time.value = INITIAL_TIME.value
  barTime.value = INITIAL_TIME.value
  cycles.value = SetCycles.value
  isSet.value = true;
  lancetta.value.style.transform = "rotate(0deg)";
  pomodoro.value.style.backgroundColor = "hsl(92, 99%, 37%)";
  colorValue.value = 92;
  RateOfChange.value = colorValue.value / INITIAL_TIME.value;
  relaxChange.value = colorValue.value / relaxingTime.value;

}

async function tick() {
  if (time.value > 0) {
    time.value--;
    lancetta.value.style.transform = `rotate(${-(time.value / barTime.value) * 360}deg)`;
    if (relaxing.value) {
      colorValue.value += relaxChange.value;
      pomodoro.value.style.backgroundColor = `hsl(${colorValue.value}, 99%, 37%)`;
    }
    else {
      colorValue.value -= RateOfChange.value;
      pomodoro.value.style.backgroundColor = `hsl(${colorValue.value}, 99%, 37%)`;
    }
  } else {
    if (cycles.value > 1) {
      if (!relaxing.value) {
        lancetta.value.style.transform = "rotate(0deg)";
        colorValue.value = 0;
        pomodoro.value.style.backgroundColor = "hsl(0, 99%, 37%)";
        let notificationMessage = "Started Relax Cycle n:" + cycles.value
        toast(notificationMessage, {
          theme: "auto",
          type: "default",
          position: "top-left",
          transition: "slide",
          autoClose: true,
          dangerouslyHTMLString: true,
          style: {
            backgroundColor: '#000', // soft yellow
            color: '#FFF',              // dark text for contrast
            border: '2px solid rgb(255, 128, 0)',
            fontWeight: 'bold',
          }
        });
        time.value = relaxingTime.value
        barTime.value = relaxingTime.value
        relaxing.value = true
      } else {
        AdvanceCycle();
        let notificationMessage = "Begin cycle n:" + cycles.value
        toast(notificationMessage, {
          theme: "auto",
          type: "default",
          position: "top-left",
          transition: "slide",
          autoClose: true,
          dangerouslyHTMLString: true,
          style: {
            backgroundColor: '#ff08b3',  // Giallo tenue
            color: '#333333',            // Testo scuro per contrasto
            border: '1px solid #e6c200', // Giallo più saturo per bordo
            fontWeight: 'bold',
            padding: '12px 16px',
            borderRadius: '8px',
          }
        });
      }
    } else {
      cycles.value = 0;
      pauseTimer();
      let notificationMessage = "Pomodoro Timer completed!";
      toast(notificationMessage, {
        theme: "auto",
        type: "default",
        position: "top-left",
        transition: "slide",
        autoClose: true,
        dangerouslyHTMLString: true,
        style: {
          backgroundColor: '#000', // soft yellow
          color: '#333',              // dark text for contrast
          border: '2px solid rgb(255, 128, 0)',
          fontWeight: 'bold',
        }
      });
      fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
        credentials: "include",
        method: "POST",
        headers: {
          Accept: "application/json",
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          beginDate: null,
          cycles: SetCycles.value,
          studyMins: SetMinutes.value,
          pauseMins: relaxingMinutes.value,
          completedCycles: SetCycles.value,
          completedDate: store.value.simDateTime, // Use the simulated date time
        })
      }).then(() => { store.value.update(); });
    }
  }
}

function forceCycle() {
  time.value = 0
}

function startTimer() {
  isRunning.value = true;
  let notificationMessage = "Pomodoro timer started";
  toast(notificationMessage, {
    theme: "auto",
    type: "default",
    position: "top-left",
    transition: "slide",
    autoClose: true,
    dangerouslyHTMLString: true,
    style: {
      backgroundColor: '#000', // soft yellow
      color: '#333',              // dark text for contrast
      border: '2px solid rgb(255, 128, 0)',
      fontWeight: 'bold',
    }
  });
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
  barTime.value = INITIAL_TIME.value;
  lancetta.value.style.transform = "rotate(0deg)";
  pomodoro.value.style.backgroundColor = "hsl(92, 99%, 37%)";
  colorValue.value = 92;
}

async function resetTimerCycle() {
  pauseTimer();
  relaxing.value = false
  time.value = INITIAL_TIME.value;
  barTime.value = INITIAL_TIME.value;
  cycles.value = SetCycles.value;
  isSet.value = false;
  lancetta.value.style.transform = "rotate(0deg)";
  pomodoro.value.style.backgroundColor = "hsl(92, 99%, 37%)";
}

async function findFactorsAsync(tot) {
  const divis = [];
  const max = Math.floor(tot / 2);
  const batchSize = 10000;
  let count = 0;
  for (let i = max; i > 0; i--) {
    if (tot % i === 0) {
      divis.push(i);

    }
    count++;
    if (count >= batchSize) {
      count = 0;
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  divis.push(tot);
  return divis;
}

async function CalcTime() {
  if (TotalTime.value < 1 || TotalTime.value > 24 * 60) {
    alert("Total time must be at least 1 minute and less than 24 hours");
    return;
  }

  let totalTime = TotalTime.value
  let divis = await findFactorsAsync(totalTime);
  if (divis.length == 0) return;

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
    relaxingMinutes.value = 0;
  } else {
    SetMinutes.value = work
    relaxingMinutes.value = relax
  }
  SetCycles.value = cycles
}


function reset() {
  SetMinutes.value = DEFAULT_STUDY_MINS;
  SetCycles.value = DEFAULT_CYCLES;
  relaxingMinutes.value = DEFAULT_PAUSE_MINS;
  TotalTime.value = 1;
  isSet.value = false;
  if (mode.value === 0) {
    lancetta.value.style.transform = "rotate(0)";
    pomodoro.value.style.backgroundColor = "#44cf69";
  }
}

async function createPomodoroEvent() {
  fetch(`${store.value.url}:${store.value.port}/pomodoro`, {
    credentials: "include",
    method: "POST",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      beginDate: startDate.value + "T" + startTime.value + ".000Z",
      cycles: SetCycles.value,
      studyMins: SetMinutes.value,
      pauseMins: relaxingMinutes.value,
      completedCycles: 0, // Assuming all cycles are completed
      completedDate: null // No completion date yet
    })
  }).then(() => { store.value.update(); });
}

onUnmounted(() => {
  if (timerId !== null) {
    clearInterval(timerId);
    reset();
  }
});
</script>

<template>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">Pomodoro Timer</h1>
        <button @click="() => { !isRunning ? reset() : null; }" type="button" class="btn-close" data-bs-dismiss="modal"
          aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column text-center">
        <div class="brand">Pomodoro Timer</div>
        <div v-if="!isSet">
          <div class="container">
            <input v-model="TotalTime" type="number" min="1" class="form-control" />
            <button @click="CalcTime" class="button-style">Generate intervals</button>
            <div class="row">
              <div class="col-4 d-flex flex-column">
                Study minutes:
                <input class="form-control" v-model="SetMinutes" type="number" style="width: 100%;" />
              </div>
              <div class="col-4 d-flex flex-column">
                Cycles
                <input v-model="SetCycles" class="form-control" type="number" min="1" max="50" style="width: 100%;" />
                <!-- <select v-model="SetCycles">
                    <option v-for="n in Math.max(SetCycles, 50)" :key="n" :value="n">{{ n }}</option>
                  </select> -->
              </div>
              <div class="col-4 d-flex flex-column">
                Relax minutes:
                <input v-model="relaxingMinutes" type="number" class="form-control" style="width: 100%;" />
              </div>
            </div>

          </div>
        </div>

        <div v-if="!isSet">
          <div class="btn-group my-2" role="group" aria-label="button group">
            <button :class="{ 'active': mode === 0, 'btn': true, 'btn-outline-success': true }" @click="mode = 0"
              style="font-size: 1.5rem;">
              Now
            </button>
            <button :disabled="isRunning" :class="{ 'active': mode === 1, 'btn': true, 'btn-outline-dark': true }"
              @click="mode = 1" style="font-size: 1.5rem;">
              Plan
            </button>
          </div>
        </div>
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

        <div v-if="mode === 0">
          <div class="d-flex justify-content-center">
            <button @click="setupTimer" :disabled="isSet" class="button-style">Set</button>
            <button @click="resetTimerCycle" :disabled="isRunning" class="reset-button button-style">Reset</button>
          </div>
          <div v-if="cycles">
            Remaining cycles: {{ cycles }}
          </div>
          <div :class="{ timerWork: !relaxing, timerRelaxing: relaxing }">{{ formatTime }}</div>

          <div class="pomodoro-top">
            <div class="leaf-1"></div>
            <div class="stem"></div>
            <div class="leaf-2"></div>
          </div>
          <div class="d-flex justify-content-center">
            <div class="clock" ref="pomodoro">
              <div class="minute" ref="lancetta"></div>
            </div>
          </div>

          <button @click="startTimer" :disabled="isRunning" class="button-style">Start</button>
          <button @click="pauseTimer" :disabled="!isRunning" class="pause-button button-style">Pause</button>
          <button @click="forceCycle" :disabled="!isRunning" class="pause-button button-style">Next</button>
        </div>
        <div v-else class="d-flex flex-column align-items-center">
          <DateTimePicker v-model:date="startDate" v-model:time="startTime" />
          <button class="button-style" @click="createPomodoroEvent()" data-bs-dismiss="modal">Create</button>
        </div>
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


.progressRelaxing {
  background-color: #4caf50;
  height: 270px;
  border-radius: 20px;
  transition: width 0.5s ease-in-out;
}

.progressWork {
  background-color: #ff0000;
  height: 270px;
  border-radius: 20px;
  transition: width 0.5s ease-in-out;
}

.button-style {
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

.pomodoro-top {
  display: flex;
  justify-content: center;
  margin-top: 10px;
  margin-bottom: -10px;
}

.pomodoro-leaf {
  width: 50px;
  height: 30px;
  background-color: #4caf50;
  border-radius: 50% 50% 0 0;
  transform: rotate(-30deg);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}


.leaf-1 {
  width: 3vmax;
  height: 3vmax;
  border-radius: 0 70px;
  background-color: #1f801f;
  /* transform: rotate(0deg); */
  transform: translateY(25%) rotate(0deg);
  margin-right: 0;
}

.leaf-2 {
  width: 3vmax;
  height: 3vmax;
  border-radius: 0 70px;
  background-color: #1f801f;
  /* transform: rotate(90deg); */
  transform: translateY(25%) rotate(90deg);
  margin-left: 0;
}

.stem {
  position: absolute;
  margin: 0;
  width:
    /* 20px */
    1.5vmax;
  height:
    /* 60px */
    4.5vmax;
  border-radius: 10px/5px;
  background-color: #1f801f;
}

.stem:before {
  position: absolute;
  left: 0;
  top: 0;
  width: 1.5vmax;
  height: 0.75vmax;
  border-radius: 10px/5px;
  background-color: #1f801f;
  content: '';
}

.stem:after {
  position: absolute;
  left: 0;
  bottom: 0;
  width: 1.5vmax;
  height: 0.75vmax;
  border-radius: 10px/5px;
  background-color: #1f801f;
  content: '';
}

.clock {
  background-color: hsl(0, 99%, 37%);
  width: 15vmax;
  height: 15vmax;
  border-radius: 50%;
  position: relative;
}

.minute {
  position: absolute;
  margin: auto;
  left: 49%;
  bottom: 50%;
  background: #000000;
  width: 2%;
  height: 48%;
  transform: rotate(0);
  transform-origin: 50% 100%;
  transition: rotate 1s linear;
}
</style>
