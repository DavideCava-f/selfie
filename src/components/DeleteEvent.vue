<script setup>
import { store } from '@/store';
import { ref, onMounted, watch } from "vue";
import { Temporal } from "@js-temporal/polyfill";

var event = ref({
  title: "",
  details: "",
  dates: []
});

function deleteEvent(i){

 
  console.log(store.value.activeEventId)
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent`, {
    headers: {
    'Content-Type': 'application/json'
      },
    method: "delete",
    body: JSON.stringify({
      "idEvent": store.value.activeEventId,
      "idOp": i
    })

  }).then(response => { return response.json() })
    .then(data => {
      //console.log(data.status)
    });

 


}

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
          {{ event.title  }}
        </h1>

        <br />
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

      </div>
      <div class="modal-body">
        <div class="my-2">
          <div>
            <button @click="deleteEvent(0)">Delete Only this Event</button>
            <button @click="deleteEvent(1)">Delete All Events like this</button>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped></style>
