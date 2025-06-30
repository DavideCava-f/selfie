<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { store } from "@/store";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

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
var startDate = ref(null);
var startTime = ref(null);
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
  pauseTimer();
  relaxing.value = false
  time.value = INITIAL_TIME.value
  barTime.value = INITIAL_TIME.value
  cycles.value = SetCycles.value
  isSet.value = true;
  lancetta.value.style.transform = "rotate(0deg)";
  //pomodoro.value.style.backgroundColor = "#44cf69";
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
      console.log("colorValue: " + colorValue.value);
      colorValue.value += relaxChange.value;
      console.log("ColorValue: " + colorValue.value);
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
            backgroundColor: '#fff8b3', // soft yellow
            color: '#333',              // dark text for contrast
            border: '1px solid #e6c200',
            fontWeight: 'bold',
          }
        });
        time.value = relaxingTime.value
        barTime.value = relaxingTime.value
        relaxing.value = true
      } else {
        AdvanceCycle();
        let notificationMessage = "Ricominciato ciclo n:" + cycles.value
        toast(notificationMessage, {
          theme: "auto",
          type: "default",
          position: "top-left",
          transition: "slide",
          autoClose: true,
          dangerouslyHTMLString: true,
          style: {
            backgroundColor: '#fff8b3', // soft yellow
            color: '#333',              // dark text for contrast
            border: '1px solid #e6c200',
            fontWeight: 'bold',
          }
        });
      }
    } else {
      cycles.value = 0;
      pauseTimer();
      let notificationMessage = "FINITOOOOOO"
      toast(notificationMessage, {
        theme: "auto",
        type: "default",
        position: "top-left",
        transition: "slide",
        autoClose: true,
        dangerouslyHTMLString: true,
        style: {
          backgroundColor: '#fff8b3', // soft yellow
          color: '#333',              // dark text for contrast
          border: '1px solid #e6c200',
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
        }).then(() => { console.log("pomodoro created correctly"); store.value.update(); });
    }
  }
}

function forceCycle() {
  time.value = 0
}

function startTimer() {
  isRunning.value = true;
  let notificationMessage = "INIZIATOOOOO"
  toast(notificationMessage, {
    theme: "auto",
    type: "default",
    position: "top-left",
    transition: "slide",
    autoClose: true,
    dangerouslyHTMLString: true,
    style: {
      backgroundColor: '#fff8b3', // soft yellow
      color: '#333',              // dark text for contrast
      border: '1px solid #e6c200',
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
  if(mode.value === 0){
    lancetta.value.style.transform = "rotate(0)";
    pomodoro.value.style.backgroundColor = "#44cf69";
  }
  
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
      completedCycles: 0, // Assuming all cycles are completed
      completedDate: null // No completion date yet
    })
  }).then(() => { console.log("pomodoro created correctly"); store.value.update(); });
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
          <div>
            <input v-model="TotalTime" type="number" min="1" />
            <button @click="CalcTime">Generate intervals</button>
            <label>
              Minutes
              <input v-model="SetMinutes" />
            </label>
            <br>
            <label>
              Cycles
              <select v-model="SetCycles">
                <option v-for="n in Math.max(SetCycles, 50)" :key="n" :value="n">{{ n }}</option>
              </select>
            </label>
            <br>
            <label>
              RelaxingMinutes
              <input v-model="relaxingMinutes" />
            </label>
          </div>
        </div>

        <div v-if="!isSet">
          <div class="btn-group " role="group" aria-label="Basic radio toggle button group">
            <button type="button" class="btn btn-outline-primary active" @click="mode = 0">
              Now
            </button>
            <button type="button" :disabled="isRunning" class="btn btn-outline-primary" @click="mode = 1">
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
            <button @click="setupTimer" :disabled="isSet">Set</button>
            <button @click="resetTimerCycle" :disabled="isRunning" class="reset-button">Reset</button>
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

          <button @click="startTimer" :disabled="isRunning">Start</button>
          <button @click="pauseTimer" :disabled="!isRunning" class="pause-button">Pause</button>
          <button @click="forceCycle" :disabled="!isRunning" class="pause-button">Next</button>
        </div>
        <div v-else>
          <input class="form-control" type="date" v-model="startDate" />
          <input class="form-control" type="time" v-model="startTime" />
          <button @click="createPomodoroEvent()">Create</button>
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
