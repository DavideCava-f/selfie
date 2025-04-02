<script setup>
import { ref, onMounted, computed } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";

const props = defineProps({
  activities: Array
});


</script>

<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Activities</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column">
        <button v-for="activity in activities" class="btn">
          {{ activity.title }} | {{ activity.dates.deadline }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
