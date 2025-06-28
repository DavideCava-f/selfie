<script setup>
//Rimasto da 1 gestire focus sulle note 2 finire il sorting delle note(Titolo, lunghezza contenuto)
import NavBar from "@/components/NavBar.vue";
import { useRouter, useRoute } from 'vue-router';
import { computed, ref, onMounted } from "vue";
import { marked } from "marked";
import { CreateNote, DuplicateNote, DeleteNote, UpdateNote, SaveAfterUpdate, getNotes } from "@/CRUDnotes";
import {
  NCtitle,
  NCcontent,
  NCtags,
  NUtitle,
  NUcontent,
  NUtags,
  NCMarkDown,
  NUMarkDown,
} from "@/CRUDnotes";
import { SortByDate, SortByTitle, SortByLength, getVisibleDate } from "@/NotesUtils";
import { NotesList } from "@/store";

const redIn = /^(\w+(,\w+)*)?$/;
var enabled = computed(() => redIn.test(NCtags.value));
var enabledUpdate = computed(() => redIn.test(NUtags.value));
var selectedCard = ref(-1);
var toDelete = ref(-1)
function expand(id){
            if (selectedCard.value != id) {
              selectedCard.value = id;
            } else {
              selectedCard.value = -1;
            }
}

onMounted(() => {
  getNotes();
});

</script>

<template>
  <div class="container  text-white">
    <div class="row align-items-end">
      <div class="col-12 d-flex justify-content-center">
        <h1>Note</h1>
      </div>
      <div class="col-3">
        <div class="col-lg-6 col-12">
          Data di creazione:
        </div>
        <div class="btn-group col-lg-6 col-12 " role="group" aria-label="Basic radio toggle button group">
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByDate(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
          </button>
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByDate(0)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="col-3">
        <div class="col-lg-6 col-12">
          Ultima modifica:
        </div>
        <div class="btn-group col-lg-6 col-12 " role="group" aria-label="Basic radio toggle button group">
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByDate(2)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
          </button>
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByDate(3)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
            </svg>
          </button>

        </div>
      </div>
      <div class="col-3">
        <div class="col-lg-6 col-12">
          Titolo:
        </div>
        <div class="btn-group col-lg-6 col-12 " role="group" aria-label="Basic radio toggle button group">
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByTitle(0)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371zm1.57-.785L11 2.687h-.047l-.652 2.157z"/>
              <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z"/>
            </svg>
          </button>
          <button class="btn btn-outline-success lg-btn responsive-button rounded-end my-sm-0" @click="SortByTitle(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-sort-alpha-down-alt" viewBox="0 0 16 16">
              <path d="M12.96 7H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645z"/>
              <path fill-rule="evenodd" d="M10.082 12.629 9.664 14H8.598l1.789-5.332h1.234L13.402 14h-1.12l-.419-1.371zm1.57-.785L11 9.688h-.047l-.652 2.156z"/>
              <path d="M4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293z"/>
            </svg>
          </button>
        </div>
      </div>
      <div class="col-3">
        <div class="col-lg-6 col-12">Lunghezza:</div>
        <div class="btn-group col-lg-6 col-12 " role="group" aria-label="Basic radio toggle button group">
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByLength(0)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-up" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"/>
            </svg>
          </button>
          <button class="btn btn-outline-success responsive-button rounded-end my-sm-0" @click="SortByLength(1)">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
  <div class="container my-2 d-flex justify-content-center">
    <div class="row">
      <div class="col-lg-6 col-12 my-lg-3 my-2 hover-div" v-for="note in NotesList" :key="note._id">
        <div class="card">
          <h2 class="card-header fw-bold" style="background-color: #c2c2c2;">{{ note.Title }}</h2>
          <div class="card-body"  style="background-color: #c2c2c2;">
            <hr />
            <div @click="expand(note._id)">
            <div v-if="note.markdown" >
              <p :class="[
                { selected: selectedCard == note._id },
                'card-text',
                'outText',
                'notSelected',
              ]" v-html="marked.parse(note.Text)" style="background-color: #cccccc;"></p>

            </div>
            <div v-else style="background-color: #c2c2c2;">
              <p :class="[
                { selected: selectedCard == note._id },
                'card-text',
                'outText',
                'notSelected',
              ]" style="background-color: #cccccc;">{{ note.Text }}</p>
            </div>
          </div>
            <span v-for="tag in note.Tags">
              <span class="badge text-bg-warning mx-1 mb-1">{{
                tag.name
              }}</span>
            </span>
            <div class="card-footer" style="background-color: #c2c2c2;">
              <div>
                <span>
                  Ultima modifica:<b> {{ getVisibleDate(note.lastUpDate) }}</b>
                </span>
                <span>
                  Creazione:<b> {{ getVisibleDate(note.creationDate) }}</b>
                </span>
              </div>
              <div class="btn-group " role="group" aria-label="Basic radio toggle button group" >
                <span><button type="button" class="btn btn-outline-danger" data-bs-toggle="modal" @click="() => {toDelete = note._id}" data-bs-target="#DeleteNoteModal">
                    Cancella
                  </button>
                </span>
                <span><button type="button" class="btn btn-outline-primary" @click="DuplicateNote(note._id)">
                    Duplica
                  </button></span>
                <span><button type="button" class="btn btn-outline-dark" data-bs-toggle="offcanvas"
                    data-bs-target="#offcanvasWithBothOptions" @click="UpdateNote(note._id)">
                    Modifica
                  </button></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div>
    <!-- crea una nuova nota -->
    <RouterLink to="#create-note">
      <button class="btn btn-primary rounded-circle fx-button d-flex align-items-center justify-content-center hover-div " style="" type="button"
        data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" class="bi bi-plus" viewBox="0 0 16 16">
          <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4"/>
        </svg>
      </button>
  <!--     <button @click.prevent="getNotes">GetNotes</button> -->

    </RouterLink>
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
                <div class="input-group">

                <input type="text" class="form-control" v-model="NCtitle" placeholder="Enter note title" />
                <button type="button" @click="() => {NCtitle = '' }" class="btn btn-light">&times;</button>

                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <div class="input-group">
                <textarea v-model="NCcontent" rows="10" class="form-control"
                  placeholder="Start typing your note..."></textarea>
                <button type="button" @click="() => {NCcontent = '' }" class="btn btn-light">&times;</button>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <div class="input-group">
                <input :class="{ border: !enabled, 'border-danger': !enabled }" v-model="NCtags" type="text"
                  class="form-control" placeholder="Add tags (comma separated)" />
                <button type="button" @click="() => {NCtags = '' }" class="btn btn-light">&times;</button>
                </div>
              </div>
              <div class="d-flex justify-content-between align-items-center">
                <label>
                  <input class="form-check-input" type="checkbox" id="untilAck" v-model="NCMarkDown" />
                  MarkDown
                </label>
                <button @click.prevent="CreateNote" :disabled="!enabled" data-bs-dismiss="offcanvas" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>


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
                <div class="input-group">
                <input type="text" class="form-control" v-model="NUtitle" placeholder="Enter note title" />
                <button type="button" @click="() => {NUtitle = '' }" class="btn btn-light">&times;</button>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Content</label>
                <div class="input-group">      
                  <textarea v-model="NUcontent" rows="10" class="form-control"
                  placeholder="Start typing your note..."></textarea>
                <button type="button" @click="() => {NUcontent = '' }" class="btn btn-light">&times;</button>
                </div>
              </div>
              <div class="mb-3">
                <label class="form-label">Tags</label>
                <div class="input-group">
                <input :class="{
                  border: !enabledUpdate,
                  'border-danger': !enabledUpdate,
                }" v-model="NUtags" type="text" class="form-control" placeholder="Add tags (comma separated)" />
                <button type="button" @click="() => {NUtags = '' }" class="btn btn-light">&times;</button>
                </div>
              </div>
              <label>
                <input class="form-check-input" type="checkbox" v-model="NUMarkDown" />
                MarkDown
              </label>
              <div class="d-flex justify-content-between align-items-center">
                <button @click.prevent="SaveAfterUpdate()" :disabled="!enabledUpdate" data-bs-dismiss="offcanvas" class="btn btn-primary">
                  <i class="fas fa-save me-2"></i>Save Note
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>



  <!-- Modal di conferma -->
<div class="modal fade" id="DeleteNoteModal" tabindex="-1" aria-labelledby="confirmDeleteLabel" aria-hidden="true">
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
        <button type="button" @click="DeleteNote(toDelete)" data-bs-dismiss="modal" class="btn btn-danger" id="confirmDeleteBtn">Conferma</button>
      </div>
      
    </div>
  </div>
</div>
</template>

<style scoped>

.outText{
  white-space: pre-wrap;

}
.notSelected {
  max-height: 50px;
  overflow: hidden;
}

.selected {
  /*background-color: blue;*/
  max-height: unset;
}

.offcanvas-size-xl {
  --bs-offcanvas-width: min(90vw, 600px);
}

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

.responsive-button {
    font-size: 1rem;
    padding: 10px 16px;
  }

  @media (max-width: 768px) {
    .responsive-button {
      font-size: 0.8rem;
      padding: 6px 12px;
    }
  }

  @media (max-width: 480px) {
    .responsive-button {
      font-size: 0.7rem;
      padding: 4px 8px;
    }
  }

  .hover-div {
      transition: transform 0.3s ease, box-shadow 0.3s ease;
    }

    .hover-div:hover {
      transform: scale(1.05);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
    }
</style>
