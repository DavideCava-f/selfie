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

watch(() => store.value.activeEventId, () => {
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
          </div>
        </div>

        <div class="my-2">
          <p>{{ event.details.text }}</p>
        </div>

        <div class="my-2">

          <a :href="event.details.link"> LONK </a>
        </div>
        <div class="my-2">
          <div v-for="date in event.dates">
            start:{{ new Date(date.begin).toDateString() }} finish:{{ new Date(date.end).toDateString() }}
          </div>
        </div>
        <br />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
