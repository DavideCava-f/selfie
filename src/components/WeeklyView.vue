<script setup>
import { ref, onMounted } from "vue";
import { store } from '@/store';
import { Temporal } from "@js-temporal/polyfill";

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

onMounted();
</script>


<template>
  <div class="container d-flex flex-column justify-content-between w-100 m-3" style="height: 70vh">
    <div v-for="day in store.week" class="row w-100 p-2 border fillable">
      <div class="col-1 h-100 p-0 d-flex justify-content-center align-items-center">
        <div
          :class="['fw-bold', 'fs-5', 'text-white', 'rounded-circle', 'p-1', day === store.week[store.simDay] ? 'bg-danger' : '']">
          {{
            day.slice(0, 3)
          }}</div>
      </div>
      <div class="col-11 h-100 d-flex flex-row justify-content-between border-start gap-1">
        <div v-if="store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day))"
          v-for="event in store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day)).events"
          class="fillable h-100 text-dark p-3" :style="{ 'background-color': getColorFromTitle(event.title) }">
          <div class="fw-bold"
            :style="{ 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
            {{ event.title }} | {{ Temporal.PlainDateTime.from(event.dates.begin.slice(0,
              -1)).toPlainTime().toString().slice(0, 5)
            }} - {{
              Temporal.PlainDateTime.from(event.dates.end.slice(0, -1)).toPlainTime().toString().slice(0, 5) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fillable {
  flex: 1;
}
</style>
