<script setup>
import OpenAI from "openai";
import { ref, watch, watchEffect, reactive } from "vue";
import { store } from "@/store";
import { EventCreator } from "@/eventCreator";
import { Temporal } from "@js-temporal/polyfill";

const activityTitle = ref(null);
const activityText = ref(null);
const activityDeadlineDate = ref(null);
const activityDeadlineTime = ref(null);

function canCreateActivity() {
    return activityTitle.value && 
    activityDeadlineDate.value &&
    activityDeadlineTime.value;
}

function setDeadlineNow() {
    activityDeadlineDate.value = store.value.simDate;
    activityDeadlineTime.value = store.value.simTime.slice(0, 5);
}

function resetDeadline() {
    activityDeadlineDate.value = null;
    activityDeadlineTime.value = null;
}

function createActivity(){
    console.log("create activity");
    fetch(`${store.value.url}:${store.value.port}/activity`, {
        credentials: "include",
        method: "POST",
        headers: {
            Accept: "application/json",
            'Content-Type': 'application/json', // Tells the server you're sending JSON
        },
        body: JSON.stringify({
            title: activityTitle.value,
            text: activityText.value,
            deadlineDate: activityDeadlineDate.value + "T" + activityDeadlineTime.value + ":00.000Z"
        })
    }).then(response => { return response.json() });
}

</script>

<template>

    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <h1 class="modal-title fs-4" id="staticBackdropLabel">
            Create new Activity
            </h1>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
            @click=""></button>
        </div>
        <div class="modal-body">
            <div class="my-2">
            <label for="title">Title</label>
            <input class="form-control" type="text" placeholder="Enter event title" v-model="activityTitle" name="value" />
            </div>

            <div class="my-2">
            <label>Details</label>
            <textarea class="form-control" rows="4" placeholder="Start typing the details..."
                v-model="activityText"></textarea>
            </div>

            <br />

            <div class="my-2">
            <label>Deadline (optional)</label>
            <div class="d-flex flex-sm-nowrap flex-wrap gap-2">
                <input class="form-control" type="date" v-model="activityDeadlineDate" />
                <input class="form-control" type="time" v-model="activityDeadlineTime" />
                <button class="btn btn-outline-primary" @click="setDeadlineNow">
                Now
                </button>
                <button class="btn btn-outline-danger" @click="resetDeadline">
                Reset
                </button>
            </div>
        </div>
        <div class="modal-footer d-flex justify-content-end">
            <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createActivity" :disabled="!canCreateActivity()">
            Create
            </button>
        </div>
        </div>
    </div>
    </div>

</template>

<style scoped>

</style>