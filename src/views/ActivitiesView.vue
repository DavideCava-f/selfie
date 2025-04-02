<script setup>

import CreateActivity from '@/components/CreateActivity.vue';
import { store } from "@/store";
import { ref, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue';

var CompletedAct = ref([])
var RetardedAct = ref([])
var TODOAct = ref([])

var ActUpdateId = ref("")
var ActUpdateTitle = ref("")
var ActUpdateText = ref("")
var ActUpdateDeadlineDate = ref("")
var ActUpdateDeadlineTime = ref("")


function toggleChange(id, compl){

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
      completion:compl
    }),
  })
    .then(() => {
        getAct()
    })
}

function deleteAct(id){

  console.log(id)
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

function getAct(){

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
      console.log(el)
      if(!el.completed){

        if(new Date().getTime()<=new Date(el.dates[0].deadline).getTime() || !el.dates[0].deadline)
        {

          console.log(el.dates[0].deadline)
          TODOAct.value.push(el)
        }else{

          RetardedAct.value.push(el)
        }
      }else{
        CompletedAct.value.push(el)
      }
     } ) 
    });
}

function updateAct(id,text,title,deadline){

  ActUpdateDeadlineDate.value= deadline.split("T")[0]
  ActUpdateDeadlineTime.value= deadline.split("T")[1].substring(0,5)
ActUpdateId.value = id
ActUpdateText.value = text
ActUpdateTitle.value = title
}

function SaveUpdateActivity(){

const id = ActUpdateId.value

console.log(id)
console.log(ActUpdateDeadlineDate.value)
console.log(ActUpdateDeadlineTime.value)
console.log(ActUpdateTitle.value)
console.log(ActUpdateText.value)


const deadline = ActUpdateDeadlineDate.value + "T" + ActUpdateDeadlineTime.value + ":00.000Z"

  fetch(`${store.value.url}:${store.value.port}/activity/update`, {
    credentials: "include",
    method:"put",
      headers: {
    "Content-Type": "application/json",
  },
    body: JSON.stringify({
      "id": id,
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
    <NavBar />
  <div class="container">
    <div class="row">
      <div class="col">
        Activities Completed
        <div v-for="act in CompletedAct">

          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.title }}</h1>
              <hr />
              {{ act.text }}
              <hr />
              <div>
                Creation:{{ new Date(act.dates[0].creation).toLocaleString() }} | Deadline:{{ new Date(act.dates[0].deadline).toLocaleString() }}
              </div>
              <div>
                <span><button class="btn btn-outline-danger" @click="deleteAct(act._id)">
                    Delete Act
                  </button>
                </span>
                 <label>Completed</label>
                 <input type="checkbox" @change="toggleChange(act._id,act.completed)" v-model="act.completed">
          </div>
          </div>
          </div>


        </div>
      </div>
      <div class="col">
        Todo Activities  
        <div v-for="act in TODOAct">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.title }}</h1>
              <hr />
              {{ act.text }}
              <hr />
              <div>
                Creation:{{ new Date(act.dates[0].creation).toLocaleString() }} | Deadline:{{ new Date(act.dates[0].deadline).toLocaleString() }}
              </div>
              <div>
                <span><button class="btn btn-outline-danger" @click="deleteAct(act._id)">
                    Delete Act
                  </button>
                </span>
                <span><button class="btn btn-outline-info" data-bs-target="#updateEventModal" @click="updateAct(act._id,act.text,act.title,act.dates[0].deadline)">
                    Update Act
                  </button>
                </span>
                 <label>Completed</label>
                 <input type="checkbox" @change="toggleChange(act._id,act.completed)" v-model="act.completed">
          </div>
          </div>
          </div>
          </div>
      </div>
      <div class="col">
        Retarded Activities
        <div v-for="act in RetardedAct">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.title }}</h1>
              <hr />
              {{ act.text }}
              <hr />
              <div>
                Creation:{{ new Date(act.dates[0].creation).toLocaleString() }} | Deadline:{{ new Date(act.dates[0].deadline).toLocaleString() }}
              </div>
              <div>
                <span><button class="btn btn-outline-danger" @click="deleteAct(act._id)">
                    Delete Act
                  </button>
                </span>
                <span><button class="btn btn-outline-info" data-bs-target="#updateEventModal" data-bs-toggle="modal" @click="updateAct(act._id,act.text,act.title,act.dates[0].deadline)">
                    Update Act
                  </button>
                </span>
                 <label>Completed</label>
                 <input type="checkbox" @change="toggleChange(act._id,act.completed)" v-model="act.completed">
          </div>
          </div>
          </div>
          </div>
      </div>
                <button class="btn bg-danger rounded-5 m-3" style="position: fixed; right: 0; bottom: 0"
                    data-bs-target="#createEventModal" data-bs-toggle="modal">
                    +
                </button>


    <div class="modal fade" id="createEventModal" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="createEventModal" aria-hidden="true">
        <CreateActivity @created="getAct()"/>
    </div>
    <div class="modal fade" id="updateEventModal" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="updateEventModal" aria-hidden="true">
        
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-4" id="staticBackdropLabel">
            Update Activity
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click=""></button>
        </div>
        <div class="modal-body">
            <div class="my-2">
            <label for="title">Title</label>
            <input class="form-control" type="text" placeholder="Enter event title" v-model="ActUpdateTitle" name="value" />
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
    </div>


  </div>
</template>

<style scoped></style>
