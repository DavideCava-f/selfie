<script setup>
import OpenAI from "openai";
import { ref, watch, watchEffect, reactive } from "vue";
import { store } from "@/store";
import { EventCreator } from "@/eventCreator";
import { Temporal } from "@js-temporal/polyfill";

var event = ref(
  {
    title: "",
    details: "",
    dates: []
  });

watch(() => store.value.activeEventId, () => {
  console.log("watch modify");
  getEvent();
})


const eventTitle = ref(null);
const eventText = ref(null);
const eventBeginDate = ref(null);
const eventBeginTime = ref(null);
const eventEndDate = ref(null);
const eventEndTime = ref(null);
const dayOfWeek = ref(null);
const repeatable = ref(false);
const frequenceSelected = ref({
  type: "d",
  option: [...Array(7)],
});
const repetitionSelected = ref({
  type: "i",
  option: "",
});
const eventLink = ref(null);

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
      beginDate: eventBeginDate.value + "T" + eventBeginTime.value + ":00.000Z",
      endDate: eventEndDate.value + "T" + eventEndTime.value + ":00.000Z"
    })
  }
  ).then(response => { return response.json() })
    .then(data => {
      var i = data;
      store.value.update();
    });
}

function getEvent() {
  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${store.value.activeEventId}`, {
    method: "get"
  }
  ).then(response => { return response.json() })
    .then(data => {
      eventTitle.value = data.title
      eventText.value = data.details.text
      eventLink.value = data.details.link
      eventBeginDate.value = data.dates[0].begin.split("T")[0]
      eventBeginTime.value = data.dates[0].begin.split("T")[1].substring(0, 5);
      eventEndDate.value = data.dates[0].end.split("T")[0]
      eventEndTime.value = data.dates[0].end.split("T")[1].substring(0, 5);
    });
}

function setBeginNow() {
  eventBeginDate.value = store.value.simDate;
  eventBeginTime.value = store.value.simTime.slice(0, 5);
}

function setEndNow() {
  eventEndDate.value = store.value.simDate;
  eventEndTime.value = store.value.simTime.slice(0, 5);
}

function resetBegin() {
  eventBeginDate.value = "";
  eventBeginTime.value = "00:00";
}

function resetEnd() {
  eventEndDate.value = "";
  eventEndTime.value = "00:01";
}

function resetFields() {
  eventTitle.value = "";
  eventText.value = "";
  resetBegin();
  resetEnd();
  repeatable.value = false;
  frequenceSelected.value = { type: "d", option: [...Array(7)] };
  repetitionSelected.value = { type: "i", option: "" };
  eventLink.value = "";
}

function allDay() {
  eventBeginTime.value = "00:00";
  eventEndTime.value = "23:59";
}

function setDayOfWeek() {
  if (!eventBeginDate.value) return;
  frequenceSelected.value.option = [...Array(7)];
  dayOfWeek.value = Temporal.PlainDate.from(eventBeginDate.value).dayOfWeek - 1;
  frequenceSelected.value.option[dayOfWeek.value] = true;
}

function canCreateEvent() {
  return (
    eventTitle.value &&
    eventBeginDate.value &&
    eventBeginTime.value &&
    eventEndDate.value &&
    eventEndTime.value &&
    (repetitionSelected.value.type &&
      (repetitionSelected.value.type === "n" ||
        repetitionSelected.value.type === "u")
      ? repetitionSelected.value.option
      : true)
  );
}


resetFields();

watch(eventBeginDate, setDayOfWeek);
</script>

<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          Modify event
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
          <input class="form-check-input" type="checkbox" id="repeatable" :disabled="eventBeginDate.toString() !== eventEndDate.toString() ||
            !eventBeginDate
            " v-model="repeatable" />
          <label class="form-check-label" for="repeatable">Update OnlyThis</label>
        </div>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="!canCreateEvent() || repeatable"
          @click="updateEvent(0)">
          Update All Events
        </button>
        <div v-if="repeatable" class="row my-2">
        <div class="my-2">
          <label>Start</label>
          <div class="d-flex flex-sm-nowrap flex-wrap gap-2">
            <input class="form-control" type="date" v-model="eventBeginDate" />
            <input class="form-control" type="time" v-model="eventBeginTime" />
            <button class="btn btn-outline-primary" @click="setBeginNow">
              Now
            </button>
            <button class="btn btn-outline-danger" @click="resetBegin">
              Reset
            </button>
          </div>
        </div>
        <div class="my-2">
          <label>End</label>
          <div class="d-flex flex-sm-nowrap flex-wrap gap-2">
            <input class="form-control" type="date" :min="eventBeginDate" v-model="eventEndDate" />
            <input class="form-control" type="time" v-model="eventEndTime" />
            <button class="btn btn-outline-primary" @click="setEndNow">
              Now
            </button>
            <button class="btn btn-outline-danger" @click="resetEnd">
              Reset
            </button>
          </div>
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
