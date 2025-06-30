<script setup>
import CreateActivity from '@/components/CreateActivity.vue';
import { store } from "@/store";
import { ref, onMounted, watch } from "vue";
import NavBar from '@/components/NavBar.vue';
import { Temporal } from '@js-temporal/polyfill';

var CompletedAct = ref([])
var RetardedAct = ref([])
var TODOAct = ref([])
var selectedCard = ref(-1)

var ActUpdateId = ref("")
var ActUpdateTitle = ref("")
var ActUpdateText = ref("")
var ActUpdateDeadlineDate = ref("")
var ActUpdateDeadlineTime = ref("")

watch(() => store.value.deltaDateTime, () => {
  //console.log("watch activity")
  getAct()
})


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
  })
    .then(() => {
      getAct()
    })
}

function deleteAct(id) {
  fetch(`${store.value.url}:${store.value.port}/activity`, {
    method: "delete",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Act: id,
    }),
  })
    .then(() => {
      getAct()
      //do something awesome that makes the world a better place
    });
}

function getAct() {
  CompletedAct.value = []
  RetardedAct.value = []
  TODOAct.value = []

  fetch(`${store.value.url}:${store.value.port}/activity`, {
    credentials: "include",
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      data.forEach((el) => {
        let date = (el.dates[0].deadline).slice(0, -1);
        if (!el.completed) {

          if (Temporal.PlainDateTime.compare(store.value.simDateTime, Temporal.PlainDateTime.from(date)) <= 0 || !el.dates[0].deadline) {
            TODOAct.value.push(el)
          } else {
            RetardedAct.value.push(el)
            console.log(el.dates[0].deadline)
          }
        } else {
          CompletedAct.value.push(el)
        }
      })
    });
}

function updateAct(id, text, title, deadline) {
  ActUpdateDeadlineDate.value = deadline.split("T")[0]
  ActUpdateDeadlineTime.value = deadline.split("T")[1].substring(0, 5)
  ActUpdateId.value = id
  ActUpdateText.value = text
  ActUpdateTitle.value = title
}

function SaveUpdateActivity() {

  const id = ActUpdateId.value

  console.log(id)
  console.log(ActUpdateDeadlineDate.value)
  console.log(ActUpdateDeadlineTime.value)
  console.log(ActUpdateTitle.value)
  console.log(ActUpdateText.value)

  const deadline = ActUpdateDeadlineDate.value + "T" + ActUpdateDeadlineTime.value + ":00.000Z"

  fetch(`${store.value.url}:${store.value.port}/activity/update`, {
    credentials: "include",
    method: "put",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      "id_Act": id,
      "title": ActUpdateTitle.value,
      "text": ActUpdateText.value,
      "deadlineDate": deadline,
    }),
  })
    .then((response) => {
      getAct();
      // return response.json();
    })
}

onMounted(() => {
  getAct()
})

</script>

<template>
  <div class="container text-white">
    <div class="row">
      <div class="col">
        <h1 class="text-center">Attività</h1>
      </div>
    </div>
    <div class="row">
      <div class="col">
        <h2 class="text-center">Attività da completare</h2>
        <div v-if="TODOAct.length == 0">
          <h4 class="text-center my-3">Nessuna attività da completare</h4>
        </div>
        <div class="hover-div" v-else v-for="act in TODOAct">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.title }}</h1>
              <hr />
              {{ act.text }}
              <hr />
              <div>
                Creation:{{ act.dates[0].creation.toString().split('T')[0] }} , {{ act.dates[0].creation.toString().split('T')[1].slice(0,-5) }} |
                Deadline:{{ act.dates[0].deadline.toString().split('T')[0] }} , {{ act.dates[0].deadline.toString().split('T')[1].slice(0,-5) }}
              </div>
              <div>
                <span><button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#DeleteActModal" @click="selectedCard = act._id">
                    Delete Act
                  </button>
                </span>
  
                <span><button class="btn btn-outline-info" data-bs-target="#updateEventModal" data-bs-toggle="modal"
                    @click="updateAct(act._id, act.text, act.title, act.dates[0].deadline)">
                    Update Act
                  </button>
                </span>
                <label>Completed</label>
                <input type="checkbox" @change="toggleChange(act._id, act.completed)" v-model="act.completed">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col">
        <h2 class="text-center text-danger">Attività in ritardo</h2>
        <div v-if="RetardedAct.length == 0">
          <h4 class="text-center my-3">Nessuna attività in ritardo</h4>
        </div>
        <div class="hover-div" v-else v-for="act in RetardedAct">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.title }}</h1>
              <hr />
              {{ act.text }}
              <hr />
              <div>
                Creation:{{ act.dates[0].creation.toString().split('T')[0] }} , {{ act.dates[0].creation.toString().split('T')[1].slice(0,-5) }} |
                Deadline:{{ act.dates[0].deadline.toString().split('T')[0] }} , {{ act.dates[0].deadline.toString().split('T')[1].slice(0,-5) }}
            </div>
            <div>
              <span><button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#DeleteActModal" @click="selectedCard = act._id">
                Delete Act
              </button>
            </span>
            <span><button class="btn btn-outline-info" data-bs-target="#updateEventModal" data-bs-toggle="modal"
              @click="updateAct(act._id, act.text, act.title, act.dates[0].deadline)">
              Update Act
            </button>
          </span>
          <label>Completed</label>
          <input type="checkbox" @change="toggleChange(act._id, act.completed)" v-model="act.completed">
        </div>
      </div>
    </div>
  </div>
</div>
</div>
<div class="col">
  <h2 class="text-center text-success">Attività completate</h2>
  <div v-if="CompletedAct.length == 0">
    <h4 class="text-center my-3">Nessuna attività completata</h4>
  </div>
  <div class="hover-div" v-else v-for="act in CompletedAct">
    <div class="card rounded-3">
      <div class="card-body">
        <h1 class="card-title fw-bold">{{ act.title }}</h1>
        <hr />
        {{ act.text }}
        <hr />
        <div>
                Creation:{{ act.dates[0].creation.toString().split('T')[0] }} , {{ act.dates[0].creation.toString().split('T')[1].slice(0,-5) }} |
                Deadline:{{ act.dates[0].deadline.toString().split('T')[0] }} , {{ act.dates[0].deadline.toString().split('T')[1].slice(0,-5) }}
        </div>
        <div>
          <span><button class="btn btn-outline-danger" data-bs-toggle="modal" data-bs-target="#DeleteActModal" @click="selectedCard = act._id">
              Delete Act
            </button>
          </span>
          <label>Completed</label>
          <input type="checkbox" @change="toggleChange(act._id, act.completed)" v-model="act.completed">
        </div>
      </div>
    </div>
  </div>
</div>
</div>
  <!-- bottone per creare una attività -->
  <button class="btn btn-primary rounded-circle fx-button d-flex align-items-center justify-content-center hover-div " style="position: fixed; right: 10; bottom: 10"
    data-bs-target="#createEventModal" data-bs-toggle="modal">
    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
    </svg>
  </button>

  <div class="modal fade" id="createEventModal" data-bs-backdrop="false" tabindex="-1"
    aria-labelledby="createEventModal" aria-hidden="true">
    <CreateActivity @created="getAct()" />
  </div>
  <div class="modal fade" id="updateEventModal" data-bs-backdrop="false" tabindex="-1"
    aria-labelledby="updateEventModal" aria-hidden="true">

    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-4" id="staticBackdropLabel">
            Update Activity
          </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click=""></button>
        </div>
        <div class="modal-body">
          <div class="my-2">
            <label for="title">Title</label>
            <input class="form-control" type="text" placeholder="Enter event title" v-model="ActUpdateTitle"
              name="value" />
          </div>

          <div class="my-2">
            <label>Text</label>
            <textarea class="form-control" rows="4" placeholder="Start typing the details..."
              v-model="ActUpdateText"></textarea>
          </div>

          <br />

          <div class="my-2">
            <label>Deadline (optional)</label>
            <div class="d-flex flex-sm-nowrap flex-wrap gap-2">
              <input class="form-control" type="date" v-model="ActUpdateDeadlineDate" />
              <input class="form-control" type="time" v-model="ActUpdateDeadlineTime" />
              <!--<button class="btn btn-outline-primary" @click="setDeadlineNow">
                Now
                </button>
                <button class="btn btn-outline-danger" @click="resetDeadline">
                Reset
                </button>--->
            </div>
          </div>
          <div class="modal-footer d-flex justify-content-end">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="SaveUpdateActivity()">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>



<!-- Modal di conferma -->
<div class="modal fade" id="DeleteActModal" tabindex="-1" aria-labelledby="confirmDeleteLabel" aria-hidden="true">
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      
      <div class="modal-header">
        <h5 class="modal-title" id="confirmDeleteLabel">Conferma eliminazione</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Chiudi"></button>
      </div>
      
      <div class="modal-body">
        Sei sicuro di voler eliminare questo elemento? L'azione non può essere annullata.
      </div>
      
      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Annulla</button>
        <button type="button" @click="deleteAct(selectedCard)" data-bs-dismiss="modal" class="btn btn-danger" id="confirmDeleteBtn">Conferma</button>
      </div>
      
    </div>
  </div>
</div>
</template>

<style scoped>
.fx-button {
  position: fixed;
  /* Posiziona l'elemento in modo fisso */
  bottom: 10vh;
  /* Distanza dal bordo inferiore */
  right: 15vw;
  width: 10vh;
  aspect-ratio: 1/1;
  /*Cerchio*/
}


.hover-div {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-div:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}
</style>
