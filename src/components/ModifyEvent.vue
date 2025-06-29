<script setup>
import OpenAI from "openai";
import { ref, watch, watchEffect, reactive, onMounted } from "vue";
import { store } from "@/store";
import { EventCreator } from "@/eventCreator";
import { Temporal } from "@js-temporal/polyfill";
import DateTimePicker from './DateTimePicker.vue';

var event = ref(
  {
    title: "",
    details: "",
    dates: []
  });

watch(() => [store.value.activeEventId, store.value.activeDate], () => {
  console.log("watch modify");
  if (store.value.activeEventId)
    getEvent();
})

const eventTitle = ref(null);
const eventText = ref(null);
const eventBeginDate = ref(null);
const eventBeginTime = ref(null);
const eventEndDate = ref(null);
const eventEndTime = ref(null);
const eventLink = ref(null);
const updateOnlyThis = ref(false);

function updateEvent(i) {
  //Da mettere Date del giorno selezionato
  console.log(eventTitle.value)
  console.log(eventText.value)
  console.log(eventLink.value)
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent`, {
    credentials: "include",
    method: "PUT",
    headers: {
      Accept: "application/json",
      'Content-Type': 'application/json', // Tells the server you're sending JSON
    },
    body: JSON.stringify({
      id: store.value.activeEventId,
      idOp: i,
      date: store.value.activeDate,
      title: eventTitle.value,
      text: eventText.value,
      link: eventLink.value,
      beginDate: eventBeginDate.value + "T" + eventBeginTime.value + ".000Z",
      endDate: eventEndDate.value + "T" + eventEndTime.value + ".000Z"
    })
  }
  ).then(response => { return response.json() })
    .then(data => {
      store.value.update();
    });
}

function getEvent() {
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${store.value.activeEventId}`, {
    method: "get",
    credentials: "include"
  }
  ).then(response => { return response.json() })
    .then(data => {
      eventTitle.value = data.title
      eventText.value = data.details.text
      eventLink.value = data.details.link
      if(store.value.activeDate === null) {
        store.value.activeDate = data.dates[0].begin.split("T")[0];
      }
      else{
        eventBeginDate.value = store.value.activeDate.toString();
      }
      eventBeginTime.value = data.dates[0].begin.split("T")[1].substring(0, 5) + ":00";
      eventEndDate.value = store.value.activeDate.toString();
      eventEndTime.value = data.dates[0].end.split("T")[1].substring(0, 5) + ":00";
      console.log("HOLA DIO CAN " + eventTitle.value)
    });
}

function setBeginNow() {
  eventBeginDate.value = store.value.simDate;
  eventBeginTime.value = store.value.simTime.slice(0, 5) + ":00";
}

function setEndNow() {
  eventEndDate.value = store.value.simDate;
  eventEndTime.value = store.value.simTime.slice(0, 5) + ":00";
}

function resetFields() {
  eventTitle.value = "";
  eventText.value = "";
  setBeginNow();
  setEndNow();
  eventLink.value = "";
}

function allDay() {
  eventBeginTime.value = "00:00:00";
  eventEndTime.value = "23:59:00";
}

function canCreateEvent() {
  try {
    const beginDateTime = Temporal.PlainDate.from(eventBeginDate.value)
      .toPlainDateTime(Temporal.PlainTime.from(eventBeginTime.value));
    const endDateTime = Temporal.PlainDate.from(eventEndDate.value)
      .toPlainDateTime(Temporal.PlainTime.from(eventEndTime.value));

    return (
      eventTitle.value &&
      eventBeginDate.value &&
      eventBeginTime.value &&
      eventEndDate.value &&
      eventEndTime.value &&
      Temporal.PlainDateTime.compare(beginDateTime, endDateTime) <= 0
    );
  } catch (e) {
    return false;
  }
}

// watch(() => [store.value.activeEventId, store.value.activeDate], () => {
//   console.log("WATCH MODIFY");
//   getEvent();
// });
</script>

<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content custom-modal">
      <div class="modal-header bg-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          Modify event
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
          @click="resetFields"></button>
      </div>
      <div class="modal-body">
        <div class="my-2">
          <label for="title">Title</label>
          <input class="form-control" type="text" placeholder="Enter event title" v-model="eventTitle" name="value" />
        </div>

        <div class="my-2">
          <label>Details</label>
          <textarea class="form-control" rows="4" placeholder="Start typing the details..."
            v-model="eventText"></textarea>
        </div>

        <div class="my-2">
          <label>Link</label>
          <input class="form-control" type="text" placeholder="Luogo fisico o virtuale" v-model="eventLink" />
        </div>
        <br />

        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" id="updateOnlyThis" v-model="updateOnlyThis" />
          <label class="form-check-label" for="updateOnlyThis">Update OnlyThis</label>
        </div>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="updateOnlyThis"
          @click="updateEvent(0)">
          Update All Events
        </button>
        <div v-if="updateOnlyThis" class="row my-2">
          <div class="my-2">
            <label>Start</label>
            <br>
            <button class="btn btn-outline-primary" @click="setBeginNow">
              Now
            </button>
            <DateTimePicker v-model:date="eventBeginDate" v-model:time="eventBeginTime" />
          </div>
          <div class="my-2">
            <label>End</label>
            <br />
            <button class="btn btn-outline-primary" @click="setEndNow">
              Now
            </button>
            <DateTimePicker v-model:date="eventEndDate" v-model:time="eventEndTime" :min="eventBeginDate" />
          </div>
          <div class="my-2">
            <button class="btn btn-outline-success" type="button" id="tuttoIlGiorno" @click="allDay">
              All day
            </button>
          </div>
          <div class="modal-footer d-flex justify-content-end">
            <button class="btn btn-secondary" :disabled="!eventText" @click="generateDetails">
              AI
            </button>
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="!canCreateEvent()"
              @click="updateEvent(1)">
              Update This Event
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.custom-modal {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(200, 50, 100, 0.1);
  border: 1px solid #ff0051;
  background-color: #ffd0da;
}

.bg-header {
  background-color: #f383a5;
}

.bg-body {
  background-color: #f383a5;
}
</style>
