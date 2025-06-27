<script setup>
import { defineProps } from 'vue';
import { store } from "@/store"

const props = defineProps({
  event: Object,
  message: String,
  nextDate: String
});

async function snooze() {
  console.log("SNOOZE: " + props.event);
  store.value.snoozed.push({
    event: props.event,
    notificationMessage: props.message,
    nextDate: props.nextDate
  });
}

</script>

<template>
  <div>
    <p>{{ message }}</p>
    <button class="btn btn-secondary" @click="snooze">Snooze (5 min)</button>
  </div>
</template>

<style scoped>
p {
  color: white;
}
</style>
