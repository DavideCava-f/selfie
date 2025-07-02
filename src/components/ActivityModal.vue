<script setup>
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";

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
    store.value.update();
  });
}

function getVisibleDate(date) {
    date = date.slice(0, -1);
    var str =
        new Date(date).toDateString() +
        " " +
        new Date(date).toTimeString().split(" ")[0];
    str = str.slice(0, -3);
    return str;
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
        <div class="my-2  ">
          <table class="table table-bordered rounded border-secondary">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Deadline</th>
              <th scope="col">Completed</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="activity in activities" :key="activity._id">
                <td>{{ activity.title}}</td>
                <td :class="{ 'text-danger': Temporal.PlainDateTime.compare(store.simDateTime, activity.dates.deadline.slice(0, -1)) > 0 }">
                  {{ getVisibleDate(activity.dates.deadline) }}
                </td>
                <td>
                  <input type="checkbox" @change="toggleChange(activity._id, activity.completed)" v-model="activity.completed"
                    data-bs-dismiss="modal">
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
      
      </div>
    </div>
  </div>
</template>

<style scoped></style>
