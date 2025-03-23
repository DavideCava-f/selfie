<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { store } from '@/store';
import { Temporal } from "@js-temporal/polyfill";
import VisualizeEvent from "@/components/VisualizeEvent.vue";

const thisMonday = computed(() => store.value.simDate.subtract({ days: store.value.simDate.dayOfWeek - 1 }).add({ weeks: store.value.weekOffset }));
var activeEventId = ref("");

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
}

function prevWeek() {
  store.value.weekOffset--;
  store.value.getEventsOfWeek(store.value.simDate);
}

onMounted();
</script>

<template>
  <div class="d-flex justify-content-between flex-fill bg-light text-center mx-1 my-3 rounded-3">
    <button class="btn d-flex align-self-center" @click="prevWeek">
      <img src="@/assets/Indietro.svg" />
    </button>
    <div class="align-self-center">{{ thisMonday }} - {{ thisMonday.add({ days: 6 }) }}
      <button v-if="store.weekOffset !== 0" class="btn"
        @click="store.weekOffset = 0; store.getEventsOfWeek(store.simDate)">R</button>
    </div>
    <button class="btn d-flex align-self-center" @click="nextWeek">
      <img src="@/assets/avanti.svg" />
    </button>
  </div>

  <div class="container d-flex flex-column justify-content-between w-100 m-1" style="min-height: 70vh;">
    <div v-for="day in store.week" class="row w-100 p-2 border fillable align-items-center">

      <div class="col-1 h-100 p-0 d-flex justify-content-center align-items-center">
        <div class="d-flex flex-column align-items-begin text-white rounded-circle p-1 text-wrap">
          <div class="fw-bold" style="font-size: 100%;">
            {{ day.slice(0, 3) }}
            <span v-if="day === store.week[store.simDay] && store.weekOffset === 0" class="text-danger">*</span>
          </div>
          <div class="fw-thin" style="font-size: 75%;">
            {{ thisMonday.add({ days: store.week.indexOf(day) }) }}
          </div>
        </div>
      </div>

      <div class="col-11 h-100 d-flex flex-row justify-content-between border-start gap-1 flex-wrap">
        <button v-if="store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day))"
          v-for="event in store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day)).events"
          class="btn fillable p-2 d-flex justify-content-between align-items-start gap-3"
          :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }"
          @click="activeEventId = event._id" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal">
          <div class="fw-bold text-start event">
            {{ event.title }}
          </div>
          <div class="text-end flex-fill text-nowrap">
            {{ Temporal.PlainDateTime.from(event.dates.begin.slice(0,
              -1)).toPlainTime().toString().slice(0, 5)
            }} - {{
              Temporal.PlainDateTime.from(event.dates.end.slice(0, -1)).toPlainTime().toString().slice(0, 5) }}
            <span
              v-if="Temporal.PlainDateTime.compare(store.simDateTime, event.dates.begin.slice(0, -1)) >= 0 && Temporal.PlainDateTime.compare(store.simDateTime, event.dates.end.slice(0, -1)) <= 0"
              class="text-danger">*</span>
          </div>
        </button>
      </div>
    </div>
  </div>
  <div class="modal fade" id="VisualizeEventModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
    <VisualizeEvent :IdEvent="activeEventId" />
  </div>
</template>

<style scoped>
.fillable {
  flex: 1 1 auto;
  min-width: 0;
  box-sizing: border-box;
}

.event {
  /* Se vuoi che si adatti allo spazio */
  max-width: 50%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
</style>
