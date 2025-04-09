<script setup>
import { store } from '@/store';
import { ref, onMounted, watch } from "vue";
import { Temporal } from "@js-temporal/polyfill";

var event = ref({
  title: "",
  details: "",
  dates: []
});

function getEvent() {
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${store.value.activeEventId}`, {
    method: "get"
  }
  ).then(response => { return response.json() })
    .then(data => {
      event.value = data
    });
}

watch(() => store.value.toggle, () => {
  console.log("watch visual");
  getEvent();
});
</script>


<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          {{ event.title }}
        </h1>

        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

      </div>
      <div class="modal-body">
        <div class="my-2">
          <div>
            <button @click="getEvent">getEvent</button>
            <button data-bs-target="#ModifyEventModal" data-bs-toggle="modal">Modify</button>
            <button data-bs-target="#DeleteEventModal" data-bs-toggle="modal">Delete</button>
          </div>
        </div>

        <div class="my-2">
          <p>{{ event.details.text }}</p>
        </div>

        <div class="my-2">

          <a :href="event.details.link"> LONK </a>
        </div>
        <div class="my-2 rounded border border-secondary">
          <ul class="list-group list-group-flush p-0">
            <li v-for="date in event.dates" class="d-flex flex-row justify-content-start list-group-item">
              <div class=" border border-secondary">
                start
              </div>
              <div class=" border border-secondary">
                {{ new Date(date.begin).toDateString() }}
              </div>
              <div class=" border border-secondary">
                finish
              </div>
              <div class=" border border-secondary">
                {{ new Date(date.end).toDateString() }}
              </div>
            </li>
          </ul>

        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
