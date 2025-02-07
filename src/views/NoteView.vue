<script setup>
import NavBar from "@/components/NavBar.vue";
import { ref } from "vue";
import { marked } from 'marked';

var NCtitle = ref("");
var NCcontent = ref("");
var NCtags = ref("");
var NotesList = ref("");
var NUtitle = ref("");
var NUcontent = ref("");
var NUtags = ref("");
var NUid = ref("")


function CreateNote() {
  //Parsing tags
  let tagsArr = NCtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let jsonTags = "[" + jsonT.toString() + "]";
  console.log(jsonTags);
  console.log(typeof jsonTags);

  fetch("http://localhost:5173/CreateNote", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      title: NCtitle.value,
      content: NCcontent.value,
      tags: jsonTags,
    }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      getNotes()
      //do something awesome that makes the world a better place
    });
}

function DeleteNote(id) {
  //Use marked before writing on NotesArea(markdown)
  console.log(typeof id)
  fetch("http://localhost:5173/DeleteNote", {
    method: "delete",
    headers: {
      'Accept': "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Note: id
    }),
  })

    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then(() => {
      NotesList.value = NotesList.value.filter(el => el._id.toString() != id)
      //do something awesome that makes the world a better place
    });
}
function getNotes() {
  //Use marked before writing on NotesArea(markdown)
  fetch("http://localhost:5173/ReadNotes")
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      NotesList.value = data;
      console.log(NotesList.value)
      //do something awesome that makes the world a better place
    });
}

function bubu() {
  console.log("bubusettete");
}

function UpdateNote(id){

  console.log(id)
  let tagsStr = "";
  const Note2Update = NotesList.value.find(el => el._id.toString() === id)
  NUtitle.value = Note2Update.Title
  NUcontent.value = Note2Update.Text
  NUtags.value = Note2Update.Tags
  NUtags.value.forEach(el => { 
    tagsStr += el.name + ","
    
  });
  NUtags.value = tagsStr.slice(0,-1)
  NUid.value = Note2Update._id
  console.log(NUid.value)
  //console.log(Note2Update)
  
}

function SaveAfterUpdate(){
  console.log(NUtags.value)
  let tagsArr = NUtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let UjsonTags = "[" + jsonT.toString() + "]";

    console.log(NUid.value)
    console.log(NUtitle.value)
    console.log(NUcontent.value)
    console.log(UjsonTags)

  fetch("http://localhost:5173/UpdateNote", {
    method: "put",
    headers: {
      'Accept': "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Note: NUid.value,
      title_note: NUtitle.value,
      content_note: NUcontent.value,
      tags_note:UjsonTags

    }),
  })

    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then(() => {
      //NotesList.value = NotesList.value.filter(el => el._id.toString() != id)
      getNotes()
      //do something awesome that makes the world a better place
    });
}
</script>

<template>
  <NavBar />
  <div class="m-3 d-flex justify-content-center input-group">
    <input
      placeholder="Find Note"
      class="rounded-start"
      type="search"
      aria-label="Search"
    />
    <button class="btn btn-outline-success rounded-end my-sm-0" type="submit">
      Search
    </button>
  </div>
  <div class="container">
    <div class="row justify-content-center">
		  <div v-for="note in NotesList" :key="note._id">
        <div @click="bubu()" class="col-md-7 mb-4">
         <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{note.Title}}</h1>
              <hr>
              <p class="card-text" v-html="marked.parse(note.Text)"></p>
              <span><button @click="DeleteNote(note._id)">Delete Note</button></span>
              <span><button data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" @click="UpdateNote(note._id)">UpdateNote</button></span>
           </div>
         </div>
        </div>
     </div>
    </div> 
  </div>    
      <div>
        <button
          class="btn btn-danger border-5 rounded-circle btn-outline-danger fx-button"
          style=""
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#offcanvasExample"
          aria-controls="offcanvasExample"
        >
          +
        </button>
        <button @click.prevent="getNotes">GetNotes</button>
      </div>

  <div
    class="offcanvas offcanvas-end offcanvas-size-xl"
    tabindex="1"
    id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel"
  >
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Notes Creation</h5>
      <button
        type="button"
        class="btn-close text-reset ms-1"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
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
                <input
                  type="text"
                  class="form-control"
                  v-model="NCtitle"
                  placeholder="Enter note title"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea
                  v-model="NCcontent"
                  rows="10"
                  class="form-control"
                  placeholder="Start typing your note..."
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <input
                  v-model="NCtags"
                  type="text"
                  class="form-control"
                  placeholder="Add tags (comma separated)"
                />
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
                <button @click.prevent="CreateNote" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions" aria-controls="offcanvasWithBothOptions">Enable both scrolling & backdrop</button>
  <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions" aria-labelledby="offcanvasWithBothOptionsLabel">
  <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Notes Update</h5>
      <button
        type="button"
        class="btn-close text-reset ms-1"
        data-bs-dismiss="offcanvas"
        aria-label="Close"
      ></button>
  </div>
  <div class="offcanvas-body">
    <div class="col-md-12">
        <div class="card">
          <div class="card-header bg-white">
            <h5 class="mb-0">UpdateNote</h5>
          </div>
          <div class="card-body">
            <form>
              <div class="mb-3">
                <label class="form-label">Title</label>
                <input
                  type="text"
                  class="form-control"
                  v-model="NUtitle"
                  placeholder="Enter note title"
                />
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea
                  v-model="NUcontent"
                  rows="10"
                  class="form-control"
                  placeholder="Start typing your note..."
                ></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <input
                  v-model="NUtags"
                  type="text"
                  class="form-control"
                  placeholder="Add tags (comma separated)"
                />
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
                <button @click.prevent="SaveAfterUpdate()" class="btn btn-primary">
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

.fx-button {
  position: fixed; /* Posiziona l'elemento in modo fisso */
  bottom: 10vh; /* Distanza dal bordo superiore */
  right: 15vw;
  width: 10vh;
  aspect-ratio: 1/1; /*Cerchio*/

  text-align: center;

  justify-content: center;
  align-items: center;
}
</style>
