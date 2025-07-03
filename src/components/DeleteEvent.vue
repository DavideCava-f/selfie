<script setup>
import { store } from '@/store';
import { ref, watch } from "vue";

var event = ref({
  title: "",
  details: "",
  dates: []
});

var datesCount = ref(0)

function deleteEvent(i) {
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent`, {
    headers: {
      'Content-Type': 'application/json'
    },
    method: "delete",
    credentials: "include",
    body: JSON.stringify({
      "idEvent": store.value.activeEventId,
      "idOp": i,
      "date": store.value.activeDate
    })

  }).then(response => { return response.json() })
    .then(data => {
  store.value.activeEventId = null;
      store.value.activeDate = null
      store.value.update();
    });
}

function getEvent() {
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${store.value.activeEventId}`, {
    method: "get",
    credentials: "include"
  }
  ).then(response => { return response.json() })
    .then(data => {
      event.value = data
      datesCount.value = data.dates.length
    });
}

watch(() => store.value.activeEventId, () => {
  if(store.value.activeEventId)
    getEvent();
});

</script>


<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content custom-modal">
      <div class="modal-header bg-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          {{ event.title }}
        </h1>

        <br />
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

      </div>
      <div class="modal-body">
        <div class="my-2">
            Are you sure?
            <hr>
          <div class="input-group">

            <button class="btn btn-dark" @click="deleteEvent(0)" data-bs-dismiss="modal">Delete Event</button>
            <div v-if="datesCount > 1">
            <button class="btn btn-dark" @click="deleteEvent(1)" data-bs-dismiss="modal">Delete This Multiple Event</button>
            </div>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-modal {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(200, 50, 100, 0.1);
  border: 1px solid #ff0051;
  background-color: #ffd0da;
}

.bg-header {
  background-color: #f383a5;
}

.bg-body {

  background-color: #f383a5;
}
</style>
