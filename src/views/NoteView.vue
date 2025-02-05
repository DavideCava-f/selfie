<script setup>
import NavBar from '@/components/NavBar.vue';
import { ref } from 'vue';

var NCtitle = ref('');
var NCcontent = ref('');
var NCtags = ref('');

function CreateNote(){

    //Parsing tags
    let tagsArr = NCtags.value.split(',')
    let jsonT =tagsArr.map((el =>{ return '{"name":"'+el+'"}'}))
    let jsonTags = "["+jsonT.toString() + "]"
    console.log(jsonTags)
    console.log(typeof jsonTags)


    
    fetch("http://localhost:5173/CreateNote", {
  method: "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  //make sure to serialize your JSON body
  body: JSON.stringify({
    title: NCtitle.value,
    content: NCcontent.value,
    tags:jsonTags
  })
})
.then( (response) => response.json()) 
.then((data) => { 
    console.log(data)
   //do something awesome that makes the world a better place
});

}


function getNotes(){
//Use marked before writing on NotesArea(markdown)

    fetch("http://localhost:5173/ReadNotes", {
  method: "get",
  headers: {
   'Accept': 'application/json',
   'Content-Type': 'application/json'
  }

})

.then( (response) => response.json()) 
.then((data) => { 
    console.log(data)
   //do something awesome that makes the world a better place
});

}
function bubu(){
  console.log("bubusettete")
}
</script>

<template>
    <NavBar />
    <div class="m-3 d-flex justify-content-center input-group ">
    <input placeholder="Find Note" class="rounded-start" type="search" aria-label="Search">
     <button class="btn btn-outline-success rounded-end my-sm-0" type="submit">Search</button> 
    </div>
    <div class="container">
  <div class="row justify-content-center">
    <div @click="bubu()" class="col-md-7 mb-4">
      <div class="card rounded-3">
        <div class="card-body">
          <h5 class="card-title fw-bold">Titolo della card</h5>
          <p class="card-text">Testo della card.</p>
        </div>
      </div>
    </div>
    <div class="col-md-7 mb-4">
      <div class="card rounded-3">
        <div class="card-body">
          <h5 class="card-title fw-bold">Titolo della card</h5>
          <p class="card-text">Testo della card.</p>
        </div>

      </div>
    </div>
    <div class="col-md-7 mb-4">
      <div class="card rounded-3">
        <div class="card-body">
          <h5 class="card-title fw-bold">Titolo della card</h5>
          <p class="card-text">Testo della card.</p>
        </div>

      </div>
    </div>
    <div class="col-md-7 mb-4">
      <div class="card rounded-3">
        <div class="card-body">
          <h5 class="card-title fw-bold">Titolo della card</h5>
          <p class="card-text">Testo della card.</p>
        </div>

      </div>
    </div>
    <div class="col-md-7 mb-4">
      <div class="card rounded-3">
        <div class="card-body">
          <h5 class="card-title fw-bold">Titolo della card</h5>
          <p class="card-text">Testo della card.</p>
        </div>

      </div>
    </div>
    <div class="">
    <button class="btn btn-danger border-5  rounded-circle btn-outline-danger fx-button" style="" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
        +
    </button>
    <button @click="getNotes()">GetNotes</button>
    </div>
  </div>
</div>

<div class="offcanvas offcanvas-end offcanvas-size-xl" tabindex="1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
  <div class="offcanvas-header">
    <h5 class="offcanvas-title" id="offcanvasExampleLabel">Notes Creation</h5>
    <button type="button" class="btn-close text-reset ms-1" data-bs-dismiss="offcanvas" aria-label="Close"></button>
  </div>
  <div class="offcanvas-body">
    
        <div class="col-md-12">
                <div class="card">
                    <div class="card-header bg-white">
                        <h5 class="mb-0">Create New Note</h5>
                    </div>
                    <div class="card-body">
                        <form>
                            <div class="mb-3">
                                <label class="form-label">Title</label>
                                <input type="text" class="form-control" v-model="NCtitle" placeholder="Enter note title">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Content</label>
                                <textarea v-model="NCcontent"  rows="10" class="form-control" placeholder="Start typing your note..."></textarea>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Tags</label>
                                <input v-model="NCtags" type="text" class="form-control"  placeholder="Add tags (comma separated)">
                            </div>
                            <div class="d-flex justify-content-between align-items-center">
                                <div class="btn-group">
                                    <button type="button" class="btn btn-outline-secondary">
                                        <i class="fas fa-bold"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary">
                                        <i class="fas fa-italic"></i>
                                    </button>
                                    <button type="button" class="btn btn-outline-secondary">
                                        <i class="fas fa-list"></i>
                                    </button>
                                </div>
                                <button @click.prevent="CreateNote()" class="btn btn-primary">
                                    <i class="fas fa-save me-2"></i>Save Note
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
    
  </div>
</div>
</template>

<style scoped>
.offcanvas-size-xl {
    --bs-offcanvas-width: min(90vw, 600px);
}

.fx-button{

  position: fixed; /* Posiziona l'elemento in modo fisso */
  bottom: 10vh; /* Distanza dal bordo superiore */
  right: 15vw;
  width: 10vh;
  aspect-ratio: 1/1; /*Cerchio*/
  
  
  text-align:center;
   
  justify-content: center; 
  align-items: center;

}
</style>