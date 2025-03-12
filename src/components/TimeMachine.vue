<script setup>
import { ref } from "vue";
import { store } from "@/store";
import { Temporal } from "@js-temporal/polyfill";

const dateSelector = ref(store.value.simDate);
const timeSelector = ref(store.value.simTime);

function save() {
  store.value.deltaDateTime = store.value.realDateTime.until(
    Temporal.PlainDateTime.from(
      `${dateSelector.value}T${timeSelector.value}:00.000`,
    ),
  );
  store.value.getEventsOfDay(store.value.simDate);
}

function reset() {
  store.value.deltaDateTime = Temporal.Duration.from({
    years: 0,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  store.value.getEventsOfDay(store.value.simDate);
}
</script>

<template>
  <div class="modal-dialog modal-dialog-centered">
    <div class="modal-content">
      <div class="modal-header bg-danger">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">Time Machine</h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input type="date" v-model="dateSelector" />
        <input type="time" v-model="timeSelector" />
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
