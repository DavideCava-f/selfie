<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { store } from '@/store';
import { getEventsOfDay } from '@/eventGetter';
import { getActivitiesOfDay } from '@/activityGetter';
import { getPomodoros } from '@/pomodoroGetter';
import { Temporal } from "@js-temporal/polyfill";

const isEvent = ref(Boolean);
const VisualizedDate = computed(() => store.value.simDate.add({ days: store.value.dayOffset }));
let ActButt = ref(null);
let EvButt = ref(null);

function getDate(i) {
  store.value.dayOffset += i;
}

function toggleChange(id, compl) {
  fetch(`${store.value.url}:${store.value.port}/activity`, {
    method: "put",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Act: id,
      completion: compl
    }),
  }).then(() => {
    store.value.update();
  });
}

function eventsMode(i) {
  if (i === 0) {
    isEvent.value = true;
    ActButt.value.classList.remove('active');
    EvButt.value.classList.add('active');
  } else {
    isEvent.value = false;
    EvButt.value.classList.remove('active');
    ActButt.value.classList.add('active');
  }
}

onMounted(async () => {
  await getEventsOfDay();
  await getActivitiesOfDay();
  await getPomodoros();
  console.log((store.value.eventsOfDay).length);
});

watch(() => store.value.dayOffset, () => getEventsOfDay());
watch(() => store.value.dayOffset, () => getActivitiesOfDay());
watch(() => store.value.dayOffset, () => getPomodoros());
</script>

<template>
  <div class="d-flex flex-column justify-content-center">
    <div class="d-flex justify-content-between flex-fill bg-light text-center mx-1 my-3 rounded-3">
      <button class="btn d-flex align-self-center" @click="getDate(-1)">
        <img src="@/assets/Indietro.svg" />
      </button>

      <div v-if="store.dayOffset === 0" class="align-self-center">
        TODAY {{ VisualizedDate.toString() }}
      </div>
      <div v-else-if="store.dayOffset === 1" class="align-self-center">
        TOMORROW {{ VisualizedDate.toString() }}
      </div>
      <div v-else class="align-self-center">
        {{ VisualizedDate.toString() }}
      </div>
      <button v-if="store.dayOffset !== 0" class="btn" @click="store.dayOffset = 0">
        R
      </button>
      <button class="btn d-flex align-self-center" @click="getDate(1)">
        <img src="@/assets/avanti.svg" />
      </button>
    </div>

    <div class="mx-1">
      <div class="btn-group " role="group" aria-label="Basic radio toggle button group">
        <button type="button" class="btn btn-outline-primary active" @click="eventsMode(0)" ref="EvButt">
          Events
        </button>
        <button type="button" class="btn btn-outline-primary" @click="eventsMode(1)" ref="ActButt">
          Activities
        </button>
      </div>
    </div>

    <div v-if="isEvent">
      <div v-if="store.eventsOfDay.length !== 0" class="overflow-scroll rounded-3 w-100" style="max-height: 70vh;">
        <button v-for="event in store.eventsOfDay" class="btn w-100 bg-light my-1 p-3 rounded-3"
          @click="store.activeEventId = event._id; store.toggle = !store.toggle; store.activeDate = store.simDate.add({ days: store.dayOffset }); console.log(store.activeEventId)"
          data-bs-target="#VisualizeEventModal" data-bs-toggle="modal">
          <h4>{{ event.title }}</h4>
          {{ event.details.text }}
          <footer>
            <a :href="event.details.link">LOCATION</a>
          </footer>
        </button>
      </div>
      <div v-else class="overflow-scroll rounded-3" style="max-height: 70vh;">
        <h4 class="text-center">No events for this day</h4>
      </div>
      <div class="overflow-scroll rounded-3 w-100" style="max-height: 40vh;">
        <button v-for="pomodoro in store.pomodoros.filter((p) => Temporal.PlainDate.compare(Temporal.PlainDate.from(p.beginDate.split('T')[0]),
          VisualizedDate) === 0)" class="btn btn-danger w-100 my-1 p-3 rounded-3"
          @click="store.activePomodoro = pomodoro" data-bs-target="#PomodoroModal" data-bs-toggle="modal">
          <h5>At {{ pomodoro.beginDate.split("T")[1].slice(0, 5) }}</h5>
          {{ pomodoro.cycles }} cycles, {{ pomodoro.studyMins }} study, {{ pomodoro.pauseMins }} pause
        </button>
      </div>
    </div>
    <div v-else>
      <div v-if="store.activitiesOfDay.length !== 0" class="overflow-scroll rounded-3" style="max-height: 70vh;">
        <div v-for="activity in store.activitiesOfDay" class="card">
          <div class="card-body">
            <h4 class="card-title fw-bold">{{ activity.title }}</h4>
            <hr />
            {{ activity.text }}
            <hr />
            <div
              :class="{ late: Temporal.PlainDateTime.compare(store.simDateTime, activity.dates[0].deadline.slice(0, -1)) > 0 }">
              Deadline: {{ Temporal.PlainDateTime.from(activity.dates[0].deadline.slice(0, -1)).toString() }}
            </div>
            <label>Completed</label>
            <input type="checkbox" @change="toggleChange(activity._id, activity.completed)"
              v-model="activity.completed">
          </div>
        </div>
      </div>
      <div v-else class="overflow-scroll rounded-3" style="max-height: 70vh;">
        <h4 class="text-center">No activities for this day</h4>
      </div>
    </div>
  </div>
</template>

<style scoped>
.late {
  color: red;
}
</style>
