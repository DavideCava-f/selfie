<script setup>
import { store } from '@/store';
import { ref, onMounted, watch } from "vue";
import ModifyEvent from "@/components/ModifyEvent.vue";

const props = defineProps(['IdEvent']);
var event = ref({
  title: "",
  details: "",
  dates: []
});

watch(() => props.IdEvent, () => {
  console.log("watch visual");
  getEvent();
})

function getEvent() {
  console.log(props.IdEvent)
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${props.IdEvent}`, {
    method: "get"
  }).then(response => { return response.json() })
    .then(data => {
      event.value = data
      console.log(data)
    });
}
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
