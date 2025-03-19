<script setup>
import { ref, onMounted } from "vue";
import { store } from '@/store';

onMounted(async () => {
  store.value.getEventsOfWeek(store.value.simDateTime);
  console.log(store.value.week.indexOf("Monday"));
});
</script>


<template>
  <button @click="store.getEventsOfWeek(store.simDate)"></button>
  <div class="container d-flex flex-column justify-content-between w-100 m-3" style="height: 70vh">
    <div v-for="day in store.week" class="row w-100 p-2 border fillable">
      <div class="col-1 h-100 p-0 d-flex justify-content-center align-items-center">
        <div
          :class="['fw-bold', 'fs-4', 'text-white', 'rounded-circle', day === store.week[store.simDay] ? 'bg-danger' : '']">
          {{
            day.slice(0, 3)
          }}</div>
      </div>
      <div class="col-11 h-100 d-flex flex-row justify-content-between border-start gap-1">
        <div v-if="store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day))"
          v-for="event in store.eventsOfWeek.find((d) => d.day === store.week.indexOf(day)).events"
          class="fillable h-100 bg-warning text-dark">{{ event.title }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fillable {
  flex: 1;
}
</style>
