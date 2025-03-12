<script setup>
//Rimasto da 1 gestire focus sulle note 2 finire il sorting delle note(Titolo, lunghezza contenuto)
import NavBar from "@/components/NavBar.vue";
import { computed, ref } from "vue";
import { marked } from "marked";
import { CreateNote, DuplicateNote, DeleteNote, UpdateNote, SaveAfterUpdate,getNotes } from "@/CRUDnotes";
import {
  NCtitle,
  NCcontent,
  NCtags,
  NUtitle,
  NUcontent,
  NUtags  } from "@/CRUDnotes";
import { SortByDate, SortByTitle, SortByLength, getVisibleDate } from "@/NotesUtils";
import { NotesList } from "@/store";

const redIn = /^(\w+(,\w+)*)?$/;
var enabled = computed(() => redIn.test(NCtags.value));
var enabledUpdate = computed(() => redIn.test(NUtags.value));
var selectedCard = ref(-1);
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
            selectedCard = note._id;
          } else {
            selectedCard = -1;
          }
          console.log(note.Text.length);
        }
        " class="col-md-7 mb-4">
          <div class="card rounded-3">
            <div class="card-body">
              <h1 class="card-title fw-bold">{{ note.Title }}</h1>
              <hr />
              <p :class="[
                { selected: selectedCard == note._id },
                'card-text',
                'notSelected',
              ]" v-html="marked.parse(note.Text)" style=""></p>
              <span v-for="tag in note.Tags">
                <span class="badge text-bg-warning mx-1 mb-1">{{
                  tag.name
                }}</span>
              </span>
              <div>
                <span><button class="btn btn-outline-danger" @click="DeleteNote(note._id)">
                    Delete Note
                  </button>
                </span>
                <span><button class="btn btn-outline-primary" @click="DuplicateNote(note._id)">
                     Duplicate Note
                  </button></span>
                <span><button class="btn btn-outline-info" data-bs-toggle="offcanvas" data-bs-target="#offcanvasWithBothOptions"
                    @click="UpdateNote(note._id)">
                    UpdateNote
                  </button></span>
              </div>
              <div>
                <span>
                  Last Updated:<b> {{ getVisibleDate(note.lastUpDate) }}</b>
                </span>
                <span>
                  Creation:<b> {{ getVisibleDate(note.creationDate) }}</b>
                </span>
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
                <input :class="{ border: !enabled, 'border-danger': !enabled }" v-model="NCtags" type="text"
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
    aria-controls="offcanvasWithBothOptions">
    Enable both scrolling & backdrop
  </button>
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
                <input :class="{
                  border: !enabledUpdate,
                  'border-danger': !enabledUpdate,
                }" v-model="NUtags" type="text" class="form-control" placeholder="Add tags (comma separated)" />
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
