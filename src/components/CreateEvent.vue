<script setup>
import OpenAI from "openai";
import { ref, watch, watchEffect, reactive } from "vue";
import { store } from "@/store";
import { EventCreator } from "@/eventCreator";
import { Temporal } from "@js-temporal/polyfill";

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
  eventBeginDate.value = store.value.simDate;
  eventBeginTime.value = store.value.simTime;
}

function setEndNow() {
  eventEndDate.value = store.value.simDate;
  eventEndTime.value = store.value.simTime;
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

function createEvent() {
  if (!repeatable.value) {
    EventCreator.insertNDaily(
      1,
      eventTitle.value,
      eventText.value,
      eventLink.value,
      eventBeginDate.value,
      eventBeginTime.value,
      eventEndDate.value,
      eventEndTime.value,
    );
  } else {
    if (frequenceSelected.value.type === "d") {
      if (repetitionSelected.value.type === "i") {
        EventCreator.insertNDaily(
          3650,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      } else if (repetitionSelected.value.type === "n") {
        EventCreator.insertNDaily(
          parseInt(repetitionSelected.value.option),
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      } else if (repetitionSelected.value.type === "u") {
        EventCreator.insertUntilDaily(
          repetitionSelected.value.option,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      }
    } else if (frequenceSelected.value.type === "w") {
      if (repetitionSelected.value.type === "i") {
        EventCreator.insertNWeekly(
          3650,
          frequenceSelected.value.option,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      } else if (repetitionSelected.value.type === "n") {
        EventCreator.insertNWeekly(
          parseInt(repetitionSelected.value.option),
          frequenceSelected.value.option,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      } else if (repetitionSelected.value.type === "u") {
        EventCreator.insertUntilWeekly(
          repetitionSelected.value.option,
          frequenceSelected.value.option,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      }
    } else if (frequenceSelected.value.type === "m") {
      if (repetitionSelected.value.type === "i") {
        EventCreator.insertNMonthly(
          3650,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      } else if (repetitionSelected.value.type === "n") {
        EventCreator.insertNMonthly(
          parseInt(repetitionSelected.value.option),
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      } else if (repetitionSelected.value.type === "u") {
        EventCreator.insertUntilMonthly(
          repetitionSelected.value.option,
          eventTitle.value,
          eventText.value,
          eventLink.value,
          eventBeginDate.value,
          eventBeginTime.value,
          eventEndDate.value,
          eventEndTime.value,
        );
      }
    }
  }
  resetFields();
}

resetFields();

watch(eventBeginDate, setDayOfWeek);
</script>

<template>
  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          Create new event
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

        <br />

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
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" id="repeatable" :disabled="eventBeginDate.toString() !== eventEndDate.toString() ||
            !eventBeginDate
            " v-model="repeatable" />
          <label class="form-check-label" for="repeatable">Repeatable</label>
        </div>
        <div v-if="repeatable" class="row my-2">
          <div class="col-sm-6 col-12">
            <label>Frequence</label>
            <div>
              <select class="form-select" v-model="frequenceSelected.type">
                <option value="d">Every day</option>
                <option value="w">One/more days a week</option>
                <option value="m">Every month this day</option>
              </select>
            </div>
            <br />
            <div v-if="frequenceSelected.type === 'w'"
              class="d-flex flex-wrap gap-1 justify-content-between gap-1 mx-2">
              <div v-for="day in store.week" :key="day">
                <input type="checkbox" class="btn-check" autocomplete="off"
                  v-model="frequenceSelected.option[store.week.indexOf(day)]"
                  :checked="store.week.indexOf(day) === dayOfWeek" :disabled="store.week.indexOf(day) === dayOfWeek"
                  :id="day" />
                <label class="btn btn-outline-primary rounded-pill" :for="day">{{ day.slice(0, 2) }}
                </label>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-12 my-sm-0 my-3">
            <label>Repetition</label>
            <div>
              <select class="form-select" v-model="repetitionSelected.type" @change="repetitionSelected.option = ''">
                <option value="i">Repeat indefinitely</option>
                <option value="n">Repeat n times</option>
                <option value="u">Repeat until</option>
              </select>
            </div>
            <br />
            <div class="d-flex align-items-center gap-1" v-if="repetitionSelected.type === 'n'">
              <input class="form-control" type="number" min="1" max="3650" placeholder="Insert n"
                v-model="repetitionSelected.option" />
              <div class="form-text text-nowrap">Min. 1, Max. 3650</div>
            </div>
            <div v-else-if="repetitionSelected.type === 'u'">
              <input class="form-control" type="date" :min="store.simDate" v-model="repetitionSelected.option" />
            </div>
          </div>
        </div>
        <br />
        <div class="my-2">
          <label>Link</label>
          <input class="form-control" type="text" placeholder="Luogo fisico o virtuale" v-model="eventLink" />
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn btn-secondary" :disabled="!eventText" @click="generateDetails">
          AI
        </button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="!canCreateEvent()"
          @click="createEvent">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
