<script setup>
import { ref } from "vue";
import { store } from '@/store';

store.value.getEventsOfWeek(store.value.simDate);
</script>


<template>
  <div class="container d-flex flex-column justify-content-between w-100 m-3" style="height: 70vh">
    <div v-for="day in store.week" class="row w-100 p-2 border fillable">
      <div class="col-1 h-100 p-0 d-flex justify-content-center align-items-center">
        <div :class="['fw-bold', 'fs-4', day === store.week[store.simDay] ? 'text-danger' : 'text-white']">{{
          day.slice(0, 3)
          }}</div>
      </div>
      <div class="col-11 h-100 d-flex flex-row justify-content-between border-start"></div>
    </div>
  </div>
</template>

<style scoped>
.fillable {
  flex: 1;
}
</style>
