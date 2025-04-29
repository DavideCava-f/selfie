
  
  <script setup>
  import { ref, computed, onUnmounted } from 'vue';
 
  var SetMinutes = ref(35)
  var SetSeconds = ref(0)
  var SetCycles = ref(5)
  var relaxingMinutes = ref(5)
  var relaxingSeconds = ref(5)
  var relaxingTime = computed(() => {return relaxingMinutes.value*60+relaxingSeconds.value} )
  const INITIAL_TIME = computed(() => {return SetMinutes.value*60+SetSeconds.value} ); // 25 minutes in seconds
  var relaxing = false 
  const time = ref(0);
  var cycles = ref(0)
  const isRunning = ref(false);
  let timerId = null;
  
  const formatTime = computed(() => {
    const minutes = Math.floor(time.value / 60);
    const seconds = time.value % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${cycles.value}`;
  });
  
  const progressBarWidth = computed(() => {
    return `${(time.value / INITIAL_TIME) * 100}%`;
  });
  
  function setupTimer(){
    pauseTimer();
    time.value = INITIAL_TIME.value 
    cycles.value = SetCycles.value
  }
  function tick() {
    if (time.value > 0) {
      time.value--;
    } else {
        if(cycles.value > 1){
            if(!relaxing){
                time.value = relaxingTime.value
                pauseTimer()
                relaxing= true
            }else{
            AdvanceCycle();
            }
        }else{

            cycles.value--
      pauseTimer();
      alert('Time is up!');
        }
    }
  }
  function forceCycle(){
    time.value =0
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
    relaxing = false
    cycles.value--;
    pauseTimer();
    time.value = INITIAL_TIME.value;
  }
  
  function resetTimerCycle() {
    pauseTimer();
    time.value = INITIAL_TIME.value;
    cycles.value = SetCycles.value;
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

      <div class="brand">Pomodoro Timer</div>
        <div>
        <div>

            <label>
                Minutes
            <select v-model="SetMinutes">
                <option v-for="n in 13" :key="n" :value="(n-1)*5">{{ (n-1)*5 }}</option>
            </select>
            </label>  
            <label>
                Seconds
            <select v-model="SetSeconds">
                <option v-for="n in 13" :key="n" :value="(n-1)*5">{{ (n-1)*5 }}</option>
            </select>
            </label>  
            <label>
                Cycles
            <select v-model="SetCycles">
                <option v-for="n in 13" :key="n" :value="n">{{ n }}</option>
            </select>
            </label>  

        </div> 
        <div>

            <label>
                RelaxingMinutes
            <select v-model="relaxingMinutes">
                <option v-for="n in 13" :key="n" :value="(n-1)*5">{{ (n-1)*5 }}</option>
            </select>
            </label>  
            <label>
                RelaxingSeconds
            <select v-model="relaxingSeconds">
                <option v-for="n in 13" :key="n" :value="(n-1)*5">{{ (n-1)*5 }}</option>
            </select>
            </label>  
        </div> 
            <button @click="setupTimer()"> Set</button>
        </div>
      <div :class="{timerWork:!relaxing, timerRelaxing:relaxing}" class="fs-3">{{ formatTime }}</div>
      <!-- <div class="progress-bar">
        <div class="progress" :style="{ width: progressBarWidth }"></div>
      </div> -->
      <div class="row d-flex justify-content-center">
        <div class="tomato align-self-center">
        <div class="highlight"></div>
      </div>
      </div>
      <button @click="startTimer" :disabled="isRunning">Start</button>
      <button @click="pauseTimer" :disabled="!isRunning" class="pause-button">Pause</button>
      <button @click="resetTimerCycle" class="reset-button">Reset</button>
      <button @click="forceCycle" :disabled="!isRunning" class="pause-button">forceCycle</button>

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

      /* Tomato container */
      .tomato {
      position: relative;
      width: 200px;
      height: 180px;
      background: radial-gradient(circle at 50% 30%, #ff4d4d, #e60000);
      border-radius: 50% 50% 45% 45%;
      box-shadow: inset -10px -10px 20px rgba(0,0,0,0.2);
    }

    /* Leaf/crown using clip-path */
.tomato::before {
  content: '';
  position: absolute;
  top: -30px;
  left: 50%;
  width: 140px;
  height: 60px;
  background: radial-gradient(circle at 50% 50%, #4a8, #285);
  /* Five-point crown shape */
  clip-path: polygon(
    50% 0%,
    62% 35%,
    100% 35%,
    70% 57%,
    84% 100%,
    50% 75%,
    16% 100%,
    30% 57%,
    0% 35%,
    38% 35%
  );
  transform: translateX(-50%);
  box-shadow: 0 3px 6px rgba(0,0,0,0.2);
}

/* Highlight spot */
    .tomato .highlight {
      position: absolute;
      top: 40px;
      left: 60px;
      width: 60px;
      height: 30px;
      background: rgba(255,255,255,0.4);
      border-radius: 50%;
      transform: rotate(-20deg);
    }
  </style>
  