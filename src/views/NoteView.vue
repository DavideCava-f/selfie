<script setup>
//Rimasto da 1 gestire focus sulle note 2 finire il sorting delle note(Titolo, lunghezza contenuto)
import NavBar from "@/components/NavBar.vue";
import { computed, ref } from "vue";
import { marked } from 'marked';
import { store } from '@/store'

var NCtitle = ref("");
var NCcontent = ref("");
var NCtags = ref("");
var NotesList = ref("");
var NUtitle = ref("");
var NUcontent = ref("");
var NUtags = ref("");
var NUid = ref("")
const redIn = /^(\w+(,\w+)*)?$/
var enabled = computed(() => redIn.test(NCtags.value));
var enabledUpdate = computed(() => redIn.test(NUtags.value));
var selectedCard = ref(-1)

function CreateNote() {
  //Parsing tags
  let tagsArr = NCtags.value.split(",");
  let jsonT = tagsArr.map((el) => {
    return '{"name":"' + el + '"}';
  });
  let jsonTags = "[" + jsonT.toString() + "]";

  var Title = NCtitle.value || "New Note"
  var Content = NCcontent.value || "No Content"
  console.log(Title)
  fetch("http://localhost:" + store.value.port + "/note", {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },

    //make sure to serialize your JSON body
    body: JSON.stringify({
      title: Title,
      content: Content,
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
function DuplicateNote(id) {
  var tagsStr = ""
  var elem = NotesList.value.find(el => el._id.toString() == id)
  NCtitle.value = elem.Title
  NCcontent.value = elem.Text
  var ArrTags = elem.Tags
  ArrTags.forEach(el => {
    tagsStr += el.name + ","
  })
  tagsStr = tagsStr.slice(0, -1)
  NCtags.value = tagsStr
  console.log(NCtitle.value)
  console.log(NCcontent.value)
  console.log(NCtags.value)

  CreateNote()

  NCtags.value = ""
  NCtitle.value = ""
  NCcontent.value = ""

}
function DeleteNote(id) {
  //Use marked before writing on NotesArea(markdown)
  console.log(typeof id)
  fetch("http://localhost:" + store.value.port + "/note", {
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
  fetch("http://localhost:" + store.value.port + "/note")
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

function UpdateNote(id) {

  console.log(id)
  let tagsStr = "";
  const Note2Update = NotesList.value.find(el => el._id.toString() === id)
  NUtitle.value = Note2Update.Title
  NUcontent.value = Note2Update.Text
  NUtags.value = Note2Update.Tags
  NUtags.value.forEach(el => {
    tagsStr += el.name + ","

  });
  NUtags.value = tagsStr.slice(0, -1)
  NUid.value = Note2Update._id
  console.log(NUid.value)
  //console.log(Note2Update)

}

function SaveAfterUpdate() {
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

  fetch("http://localhost:" + store.value.port + "/note", {
    method: "put",
    headers: {
      'Accept': "application/json",
      "Content-Type": "application/json",
    },
    //make sure to serialize your JSON body
    body: JSON.stringify({
      id_Note: NUid.value,
      title_note: NUtitle.value || "No Title",
      content_note: NUcontent.value || "No Content",
      tags_note: UjsonTags

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

function SortByDate(v) {

  if (v == 0) {
    NotesList.value.sort((i, j) => { return (new Date(i.creationDate).getTime() < new Date(j.creationDate).getTime()) ? 1 : -1 })
  } else if (v == 1) {

    NotesList.value.sort((i, j) => { return (new Date(i.creationDate).getTime() > new Date(j.creationDate).getTime()) ? 1 : -1 })
  } else if (v == 2) {
    NotesList.value.sort((i, j) => { return (new Date(i.lastUpDate).getTime() < new Date(j.lastUpDate).getTime()) ? 1 : -1 })
  } else {

    NotesList.value.sort((i, j) => { return (new Date(i.lastUpDate).getTime() > new Date(j.lastUpDate).getTime()) ? 1 : -1 })

  }
}

function SortByTitle(v) {

  if (v == 0) {
    NotesList.value.sort((i, j) => { return (i.Title[0] > j.Title[0]) ? 1 : -1 })
  } else if (v == 1) {

    NotesList.value.sort((i, j) => { return (i.Title[0] < j.Title[0]) ? 1 : -1 })
  }
}
         
function SortByLength(v) {

  if (v == 0) { 
    NotesList.value.sort((i, j) => {/* return (i.Text.length > j.Text.lenght) ? 1 : -1*/
      if(i.Text.length > j.Text.length){
        return 1
      }
      return -1

     })
  } else if (v == 1) {

    //NotesList.value.sort((i, j) => { return (i.Text.length > j.Text.lenght) ? 1 : -1 })
    NotesList.value.sort((i, j) => {
      if(i.Text.length < j.Text.length){
        return 1
      }
      return -1

     })
  }
}

function getVisibleDate(date) {

  /* NotesList.value = NotesList.value.sort((i,j) => {
     
   } )*/

  //var no= NotesList.value[0].lastUpDate
  var str = new Date(date).toDateString() + " " + new Date(date).toTimeString().split(" ")[0]
  str = str.slice(0, -3)
  return str

}
</script>

<template>
  <NavBar />

  <div class="m-3 d-flex justify-content-evenly input-group">
    <div class="m-3">
      SortByCreationDate:
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByDate(0)">
        Newest to Oldest
      </button>
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByDate(1)">
        Oldest to Newest
      </button>

    </div>
    <div class="m-3">
      SortByLastUpdate:
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByDate(2)">
        Newest to Oldest
      </button>
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByDate(3)">
        Oldest to Newest
      </button>
    </div>
    <div class="m-3">
      SortByTitle:
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByTitle(0)">
        A-Z
      </button>
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByTitle(1)">
        Z-A
      </button>
    </div>
    <div class="m-3">
      SortByTitle:
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByLength(0)">
        Length Cresc
      </button>
      <button class="btn btn-outline-success rounded-end my-sm-0" @click="SortByLength(1)">
        Length Decr
      </button>
    </div>
  </div>


  <div class="container">
    <div class="row justify-content-center">
      <div v-for="note in NotesList" :key="note._id">
        <div @click="() => {
          if (selectedCard != note._id) {
            selectedCard = note._id
          } else {
            selectedCard = -1
          }
          console.log(note.Text.length)
        }" class="col-md-7 mb-4">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ note.Title }}</h1>
              <hr>
              <p :class="[{ selected: selectedCard == note._id }, 'card-text', 'notSelected']"
                v-html="marked.parse(note.Text)" style=""></p>
              <span v-for="tag in note.Tags">
                <span class="badge text-bg-warning mx-1 mb-1">{{ tag.name }}</span>

              </span>
              <div>

                <span><button @click="DeleteNote(note._id)">Delete Note</button></span>
                <span><button @click="DuplicateNote(note._id)">Duplicate Note</button></span>
                <span><button data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
                    @click="UpdateNote(note._id)">UpdateNote</button></span>

              </div>
              <div>

                <span> Last Updated:<b> {{ getVisibleDate(note.lastUpDate) }}</b> </span>
                <span> Creation:<b> {{ getVisibleDate(note.creationDate) }}</b> </span>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <button class="btn btn-danger border-5 rounded-circle btn-outline-danger fx-button" style="" type="button"
      data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
      +
    </button>
    <button @click.prevent="getNotes">GetNotes</button>
  </div>

  <div class="offcanvas offcanvas-end offcanvas-size-xl" tabindex="1" id="offcanvasExample"
    aria-labelledby="offcanvasExampleLabel">
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
                <input type="text" class="form-control" v-model="NCtitle" placeholder="Enter note title" />
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea v-model="NCcontent" rows="10" class="form-control"
                  placeholder="Start typing your note..."></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <input :class="{ 'border': !enabled, 'border-danger': !enabled }" v-model="NCtags" type="text"
                  class="form-control" placeholder="Add tags (comma separated)" />
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
                <button @click.prevent="CreateNote" :disabled="!enabled" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>

  <button class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
    aria-controls="offcanvasWithBothOptions">Enable both scrolling & backdrop</button>
  <div class="offcanvas offcanvas-start" data-bs-scroll="true" tabindex="-1" id="offcanvasWithBothOptions"
    aria-labelledby="offcanvasWithBothOptionsLabel">
    <div class="offcanvas-header">
      <h5 class="offcanvas-title" id="offcanvasExampleLabel">Notes Update</h5>
      <button type="button" class="btn-close text-reset ms-1" data-bs-dismiss="offcanvas" aria-label="Close"></button>
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
                <input type="text" class="form-control" v-model="NUtitle" placeholder="Enter note title" />
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <textarea v-model="NUcontent" rows="10" class="form-control"
                  placeholder="Start typing your note..."></textarea>
              </div>
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <input :class="{ 'border': !enabledUpdate, 'border-danger': !enabledUpdate }" v-model="NUtags"
                  type="text" class="form-control" placeholder="Add tags (comma separated)" />
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
                <button @click.prevent="SaveAfterUpdate()" :disabled="!enabledUpdate" class="btn btn-primary">
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
.notSelected {

  max-height: 50px;
  overflow: hidden
}

.selected {
  /*background-color: blue;*/
  max-height: unset
}

.offcanvas-size-xl {
  --bs-offcanvas-width: min(90vw, 600px);
}

.fx-button {
  position: fixed;
  /* Posiziona l'elemento in modo fisso */
  bottom: 10vh;
  /* Distanza dal bordo superiore */
  right: 15vw;
  width: 10vh;
  aspect-ratio: 1/1;
  /*Cerchio*/

  text-align: center;

  justify-content: center;
  align-items: center;
}
</style>
