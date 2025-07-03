<script setup>
import { defineProps } from 'vue';
import "vue3-toastify/dist/index.css";

const props = defineProps({
  message: String,
  onReshow: Function
});

async function snooze() {
  props.onReshow();
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
