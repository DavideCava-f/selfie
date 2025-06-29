<script setup>
import { store } from '@/store';
import { ref, onMounted, watch, computed } from "vue";
import { Temporal } from "@js-temporal/polyfill";

var event = ref({
  title: "",
  details: "",
  dates: []
});

var isUrl = computed(() => {try{
const url = new URL(event.value.details.link)
 return url.protocol === "http:" || url.protocol ==="https:";
}catch{
  return false
}

})


function getEvent() {
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${store.value.activeEventId}`, {
    method: "get",
    credentials: "include"
  }
  ).then(response => { return response.json() })
    .then(data => {
      event.value = data
    });
}

watch(() => store.value.toggle, () => {
  console.log("watch visual");
  if (store.value.activeEventId)
    getEvent();
});
</script>


<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content custom-modal">
      <div class="modal-header bg-header text-dark">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          {{ event.title }}
        </h1>

        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

      </div>
      <div class="modal-body">
        <div class="d-flex justify-content-around gap-2 mb-3">
        <div class="my-2">
          <p>{{ event.details.text }}</p>
        </div>
<i class="fa-solid fa-trash"></i>

          <div>

            <button class="btn btn-sm btn-outline-dark" data-bs-target="#ModifyEventModal" data-bs-toggle="modal"> <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293zm-9.761 5.175-.106.106-1.528 3.821 3.821-1.528.106-.106A.5.5 0 0 1 5 12.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.468-.325"/>
</svg>  Modify</button>
            <button class="btn btn-sm btn-outline-danger" data-bs-target="#DeleteEventModal" data-bs-toggle="modal"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3" viewBox="0 0 16 16">
  <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5M11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47M8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5"/>
</svg>  Delete</button>
          </div>
        

        </div>
        <div class="my-2">
          Risorsa o Luogo:
          <a v-if="isUrl" :href="event.details.link"> LONK </a>
          <span v-else>
            {{ event.details.link }}
          </span>
        </div>
      
        <div class="my-2  ">
          <table class="table table-bordered rounded border-secondary">
            <thead>
              <tr>
                <th scope="col">Start</th>
                <th scope="col">End</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="date in event.dates" :key="date.begin">
                <td>{{ new Date(date.begin).toDateString() }}</td>
                <td>{{ new Date(date.end).toDateString() }}</td>
              </tr>
            </tbody>
          </table> 
        </div>
        <br />
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
.bg-body{

  background-color: #f383a5;
}
</style>
