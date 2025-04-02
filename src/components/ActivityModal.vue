<script setup>
import { ref, onMounted, computed } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";
import { getActivitiesOfDay } from "@/activityGetter";

const props = defineProps({
  activities: Array
});

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
    console.log("dio merda");
    store.value.update();
  });
}
</script>

<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title" id="exampleModalLabel">Activities</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body d-flex flex-column">
        <div v-for="activity in activities" class="d-flex justify-content-between align-items-center">
          <div>
            {{ activity.title }} | <span
              :class="{ 'text-danger': Temporal.PlainDateTime.compare(store.simDateTime, activity.dates.deadline.slice(0, -1)) > 0 }">{{
                activity.dates.deadline }}</span>
          </div>
          <div>
            <label>Completed</label>
            <input type="checkbox" @change="toggleChange(activity._id, activity.completed)" v-model="activity.completed"
              data-bs-dismiss="modal">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
