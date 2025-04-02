<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { store } from '@/store';
import { Temporal } from "@js-temporal/polyfill";
import VisualizeEvent from "@/components/VisualizeEvent.vue";
import ActivityModal from "@/components/ActivityModal.vue";

const thisMonday = computed(() => store.value.simDate.subtract({ days: store.value.simDate.dayOfWeek - 1 }).add({ weeks: store.value.weekOffset }));
const activitiesOfSelectedDay = ref({});

function getColorFromTitle(title) {
  // Create a hash from the title string
  let hash = 0;
  for (let i = 0; i < title.length; i++) {
    hash = title.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Convert the hash to an RGB color
  let color = '#';
  for (let i = 0; i < 3; i++) {
    // Extract 8 bits at a time from the hash
    const value = (hash >> (i * 8)) & 0xFF;
    // Convert the value to a two-digit hexadecimal string
    color += ('00' + value.toString(16)).slice(-2);
  }
  return color;
}

function getInvertedColor(hex) {
  // Remove '#' if present
  hex = hex.replace(/^#/, '');

  // If shorthand notation, expand it (e.g., "abc" -> "aabbcc")
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // Validate hex color length
  if (hex.length !== 6) {
    throw new Error('Invalid HEX color.');
  }

  // Convert hex to RGB components
  let r = parseInt(hex.substring(0, 2));
  let g = parseInt(hex.substring(2, 4));
  let b = parseInt(hex.substring(4, 6));

  // Invert each color component
  r = 255 - r;
  g = 255 - g;
  b = 255 - b;

  // Convert the inverted values back to hex and return the result
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

function nextWeek() {
  store.value.weekOffset++;
  store.value.getEventsOfWeek(store.value.simDate);
  store.value.getActivitiesOfWeek(store.value.simDate);
}

function prevWeek() {
  store.value.weekOffset--;
  store.value.getEventsOfWeek(store.value.simDate);
  store.value.getActivitiesOfWeek(store.value.simDate);
}

onMounted(() => {
  store.value.getEventsOfWeek(store.value.simDate);
  store.value.getActivitiesOfWeek(store.value.simDate);
});
</script>

<template>
  <div class="d-flex justify-content-between bg-light text-center mx-1 my-3 rounded-3">
    <button class="btn d-flex align-self-center" @click="prevWeek">
      <img src="@/assets/Indietro.svg" />
    </button>
    <div class="align-self-center">
      {{ thisMonday.toLocaleString("it-IT", { month: "long", year: "numeric" }) }}
      <button v-if="store.weekOffset !== 0" class="btn"
        @click="store.weekOffset = 0; store.getEventsOfWeek(store.simDate); store.getActivitiesOfWeek(store.simDate)">R</button>
    </div>
    <button class="btn d-flex align-self-center" @click="nextWeek">
      <img src="@/assets/avanti.svg" />
    </button>
  </div>

  <div class="container-fluid d-flex flex-column justify-content-between w-100 m-1" style="min-height: 70vh;">
    <div v-for="day in store.week" class="row w-100 border fillable align-items-center">
      <div class="h-100 p-0 d-flex flex-column flex-lg-row flex-fill justify-content-center align-items-center"
        style="width: 12%; max-width: 12%;">
        <div class="d-flex flex-column align-items-center text-white rounded-circle text-wrap">
          <div class="fw-bold fs-6">
            {{ day.slice(0, 3) }}
          </div>
          <div class="fw-thin" style="font-size: 75%;">
            {{ thisMonday.add({ days: store.week.indexOf(day) }).day }}
          </div>
          <div v-if="day === store.week[store.simDay] && store.weekOffset === 0" class="text-danger">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-bullseye"
              viewBox="0 0 16 16">
              <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
              <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
              <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
              <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
            </svg>
          </div>
        </div>
        <div v-if="store.activitiesOfWeek.find((d) => d.day === store.week.indexOf(day))"
          class="d-flex flex-column align-items-center ms-1">
          <button class="btn rounded-circle bg-danger text-white"
            @click="activitiesOfSelectedDay = store.activitiesOfWeek.find((d) => d.day === store.week.indexOf(day)).activities; console.log(activitiesOfSelectedDay)"
            data-bs-target="#VisualizeActivitiesModal" data-bs-toggle="modal">
            A
          </button>
        </div>
      </div>

      <div class="h-100 d-flex flex-row justify-content-between border-start gap-1 flex-wrap" style="width: 88%;">
        <button v-if="store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day))"
          v-for="event in store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day)).events"
          class="btn fillable p-2 d-flex justify-content-between align-items-center gap-3"
          :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }"
          @click="store.activeEventId = event._id;
          store.activeDate = thisMonday.add({ days: store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day)).day });
          console.log(store.activeDate);" data-bs-target="#VisualizeEventModalW" data-bs-toggle="modal">
          <div class="fw-bold text-start event">
            {{ event.title }}
          </div>
          <div class="text-end flex-fill text-nowrap">
            {{ Temporal.PlainDateTime.from(event.dates.begin.slice(0,
              -1)).toPlainTime().toString().slice(0, 5)
            }} - {{
              Temporal.PlainDateTime.from(event.dates.end.slice(0, -1)).toPlainTime().toString().slice(0, 5) }}
            <span
              v-if="Temporal.PlainDateTime.compare(store.simDateTime, Temporal.PlainDateTime.from(event.dates.begin.slice(0, -1))) >= 0 &&
                Temporal.PlainDateTime.compare(store.simDateTime, Temporal.PlainDateTime.from(event.dates.end.slice(0, -1))) <= 0"
              class="text-danger mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                class="bi bi-record2 align-baseline rightnow" viewBox="0 0 16 16">
                <path d="M8 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8m0 1A5 5 0 1 0 8 3a5 5 0 0 0 0 10" />
                <path d="M10 8a2 2 0 1 1-4 0 2 2 0 0 1 4 0" />
              </svg>
            </span>
          </div>
        </button>
      </div>
    </div>
  </div>
  <div class="modal fade" id="VisualizeEventModalW" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
    <VisualizeEvent />
  </div>
  <div class="modal fade" id="VisualizeActivitiesModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
    <ActivityModal :activities="activitiesOfSelectedDay" />
  </div>
</template>

<style scoped>
.fillable {
  flex: 1 1 auto;
  min-width: 0;
  /* box-sizing: border-box; */
}


.event {
  /* Se vuoi che si adatti allo spazio */
  max-width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  padding: 0%;
}

.rightnow {
  animation-name: fade;
  animation-duration: 1s;
  animation-iteration-count: infinite;
}

@keyframes fade {

  0%,
  100% {
    opacity: 0;
  }

  50% {
    opacity: 1;
  }
}
</style>
