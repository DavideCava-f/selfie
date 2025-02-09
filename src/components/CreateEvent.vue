<script setup>
import OpenAI from "openai";
import { ref } from "vue";
import { store } from "@/store";

const eventTitle = ref(null);
const eventText = ref(null);
const eventBeginDate = ref(null);
const eventBeginHourMinSec = ref(null);
const eventEndDate = ref(null);
const eventEndHourMinSec = ref(null);
const repeatable = ref(false);
const frequenceSelected = ref({
  type: "d",
  option: "",
});
const repetitionSelected = ref({
  type: "i",
  option: "",
});
const eventLink = ref(null);

async function generateDetails() {
  const completion = await store.value.openai.chat.completions.create({
    model: "deepseek/deepseek-r1-distill-llama-70b:free",
    messages: [
      {
        role: "user",
        content: `Given a description of an event of a calendar app, \
                  in a language you MUST recognize, produce a \
                  title that would fit it. The title should indicate the \
                  action described in the description.
                  Note: you MUST reply ONLY with the title you've came up with \
                  (in the recognized language). \
                  Do NOT add anything else, just the words (i.e. not quotation marks).
                  The description is: \
                  ${eventText.value}.`,
      },
    ],
  });
  eventTitle.value = completion.choices[0].message.content;
}

function setBeginNow() {
  eventBeginDate.value = store.value.formattedSimDate;
  eventBeginHourMinSec.value = store.value.formattedSimHourMinSec;
}

function setEndNow() {
  eventEndDate.value = store.value.formattedSimDate;
  eventEndHourMinSec.value = store.value.formattedSimHourMinSec;
}

function resetBegin() {
  eventBeginDate.value = "";
  eventBeginHourMinSec.value = "00:00:00";
}

function resetEnd() {
  eventEndDate.value = "";
  eventEndHourMinSec.value = "00:00:00";
}

function resetFields() {
  eventTitle.value = "";
  eventText.value = "";
  resetBegin();
  resetEnd();
  repeatable.value = false;
  repetitionSelected.value = { type: "i", option: "" };
  eventLink.value = "";
}

function allDay() {
  eventBeginHourMinSec.value = "00:00:00";
  eventEndHourMinSec.value = "23:59:59";
}

function canCreateEvent() {
  // TODO
  return true;
}

function createEvent() {
  resetFields();
}

resetFields();
</script>

<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          Create new event
        </h1>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="modal"
          aria-label="Close"
          @click="resetFields"
        ></button>
      </div>
      <div class="modal-body">
        <div class="my-2">
          <label for="title">Title</label>
          <input
            class="form-control"
            type="text"
            placeholder="Enter event title"
            v-model="eventTitle"
            name="value"
          />
        </div>

        <div class="my-2">
          <label>Details</label>
          <textarea
            class="form-control"
            rows="4"
            placeholder="Start typing the details..."
            v-model="eventText"
          ></textarea>
        </div>

        <br />

        <div class="my-2">
          <label>Start</label>
          <div class="d-flex flex-sm-nowrap flex-wrap">
            <input
              class="form-control me-sm-2"
              type="date"
              v-model="eventBeginDate"
            />
            <input
              class="form-control me-sm-2"
              type="time"
              v-model="eventBeginHourMinSec"
            />
            <button class="btn btn-outline-primary me-2" @click="setBeginNow">
              Now
            </button>
            <button class="btn btn-outline-danger" @click="resetBegin">
              Reset
            </button>
          </div>
        </div>
        <div class="my-2">
          <label>End</label>
          <div class="d-flex flex-sm-nowrap flex-wrap">
            <input
              class="form-control me-sm-2"
              type="date"
              v-model="eventEndDate"
            />
            <input
              class="form-control me-sm-2"
              type="time"
              v-model="eventEndHourMinSec"
            />
            <button class="btn btn-outline-primary me-2" @click="setEndNow">
              Now
            </button>
            <button class="btn btn-outline-danger" @click="resetEnd">
              Reset
            </button>
          </div>
        </div>
        <div class="my-2">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="tuttoIlGiorno"
              @change="(event) => (event.target.checked ? allDay() : null)"
            />
            <label class="form-check-label" for="tuttoIlGiorno">All day</label>
          </div>
        </div>
        <div class="form-check my-2">
          <input
            class="form-check-input"
            type="checkbox"
            id="repeatable"
            v-model="repeatable"
          />
          <label class="form-check-label" for="repeatable">Repeatable</label>
        </div>
        <div v-if="repeatable" class="row my-2">
          <!-- TODO -->
          <div class="col-sm-6 col-12">
            <label>Frequence</label>
            <div>
              <select class="form-select" v-model="frequenceSelected.type">
                <option value="d">Every day</option>
                <option value="1w">One day a week</option>
                <option value="+w">More days a week</option>
                <option value="m">Every month this day</option>
              </select>
            </div>
            <br />
            <div
              v-if="frequenceSelected.type === '+w'"
              class="d-flex flex-wrap gap-1"
            >
              <button
                type="button"
                class="btn btn-outline-primary rounded-circle"
                data-bs-toggle="button"
                v-for="day in store.week"
                :key="day"
              >
                {{ day.slice(0, 2) }}
              </button>
            </div>
          </div>
          <div class="col-sm-6 col-12">
            <label>Repetition</label>
            <div>
              <select
                class="form-select"
                v-model="repetitionSelected.type"
                @change="repetitionSelected.option = ''"
              >
                <option value="i">Repeat indefinitely</option>
                <option value="n">Repeat n times</option>
                <option value="u">Repeat until</option>
              </select>
            </div>
            <br />
            <div v-if="repetitionSelected.type === 'n'">
              <input
                class="form-control"
                type="number"
                min="1"
                max="3650"
                placeholder="Insert n"
                v-model="repetitionSelected.option"
              />
              <div class="form-text">Min. 1, Max. 3650</div>
            </div>
            <div v-else-if="repetitionSelected.type === 'u'">
              <input
                class="form-control"
                type="date"
                :min="store.formattedSimDate"
                v-model="repetitionSelected.option"
              />
            </div>
          </div>
        </div>
        <div class="my-2">
          <label>Link</label>
          <input
            class="form-control"
            type="text"
            placeholder="Luogo fisico o virtuale"
            v-model="eventLink"
          />
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button
          class="btn btn-secondary"
          :disabled="!eventText"
          @click="generateDetails"
        >
          AI
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-bs-dismiss="modal"
          :disabled="!canCreateEvent"
          @click="createEvent"
        >
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
