<script setup>
import { defineProps } from 'vue';
import "vue3-toastify/dist/index.css";

const props = defineProps({
  event: Object,
  message: String,
  nextDate: Object,
  onReshow: Function
});

async function snooze() {
  console.log("SNOOZE: " + props.event);
  props.onReshow();
}
</script>

<template>
  <div >
    <p>{{ message }}</p>
    <button class="btn btn-secondary" @click="snooze">Snooze (5 min)</button>
  </div>
</template>

<style scoped>
p {
  color: white;
}
</style>
