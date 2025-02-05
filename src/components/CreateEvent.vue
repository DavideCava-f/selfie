<script setup>
import OpenAI from "openai";
import { ref } from "vue";
import { store } from "@/store";

const eventTitle = ref(null);
const eventText = ref(null);

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
                  The description is \
                  ${eventText.value}.`,
      },
    ],
  });
  eventTitle.value = completion.choices[0].message.content;
}
</script>

<template>
  <div class="modal-dialog modal-dialog-centered">
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
          <label>Inizio</label>
          <input class="form-control" type="date" />
          <label>Fine</label>
          <input class="form-control" type="date" />
          <label>Tutto il giorno</label>
          <input class="" type="checkbox" />
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
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
          Create
        </button>
      </div>
    </div>
  </div>
</template>

<style></style>
