<script setup>

import { ref, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue';

var CompletedAct = ref([])
var RetardedAct = ref([])
var TODOAct = ref([])

function deleteAct(id){

  fetch(`${store.value.url}:${store.value.port}/activities`, {
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
  
  fetch(`${store.value.url}:${store.value.port}/activities`, {
    credentials: "include",
  })
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
     data.forEach((el) => {
      if(!el.completed){
        if(Date.now()<data.dates.deadline)
        {
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
        Activities TODO
        <div v-for="act in CompletedAct">

          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.Title }}</h1>
              <hr />
              {{ act.text }}
              <div>
                <span><button class="btn btn-outline-danger" @click="deleteAct(act._id)">
                    Delete Act
                  </button>
                </span>
          </div>
          </div>
          </div>


        </div>
      </div>
      <div class="col">
        Retarded Activities  
        <div v-for="act in CompletedAct">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.Title }}</h1>
              <hr />
              {{ act.text }}
              <div>
                <span><button class="btn btn-outline-danger" @click="deleteAct(act._id)">
                    Delete Act
                  </button>
                </span>
          </div>
          </div>
          </div>
          </div>
      </div>
      <div class="col">
        Completed Activities
        <div v-for="act in CompletedAct">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ act.Title }}</h1>
              <hr />
              {{ act.text }}
              <div>
                <span><button class="btn btn-outline-danger" @click="deleteAct(act._id)">
                    Delete Act
                  </button>
                </span>
          </div>
          </div>
          </div>
          </div>
      </div>
    </div>


  </div>
</template>

<style scoped></style>
