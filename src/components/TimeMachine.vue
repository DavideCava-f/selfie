<script setup>
import { ref } from 'vue';
import { store } from "@/store";

const dateSelector = ref(store.value.formattedSimDate);
const hourSelector = ref(store.value.formattedSimHourMinSec);

function save() {
  store.value.deltaTime = new Date(dateSelector.value + "T" + hourSelector.value + ".000Z").getTime() - store.value.realTime;
}

function reset() {
  store.value.deltaTime = 0;
}
</script>

<template>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">Time Machine</h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
        ></button>
      </div>
      <div class="modal-body">
        <input type="date" v-model="dateSelector">
        <input type="time" v-model="hourSelector">
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button type="button" @click="reset" class="btn btn-secondary" data-bs-dismiss="modal">
          Reset
        </button>
        <button type="button" @click="save" class="btn btn-primary" data-bs-dismiss="modal">
          Change
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
