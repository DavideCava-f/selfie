<script setup>

import CreateActivity from '@/components/CreateActivity.vue';
import { store } from "@/store";
import { ref, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue';

var CompletedAct = ref([])
var RetardedAct = ref([])
var TODOAct = ref([])


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
    </div>


  </div>
</template>

<style scoped></style>
