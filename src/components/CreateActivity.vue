<script setup>
import OpenAI from "openai";
import { ref, watch, watchEffect, reactive } from "vue";
import { store } from "@/store";
import { EventCreator } from "@/eventCreator";
import { Temporal } from "@js-temporal/polyfill";
import DateTimePicker from './DateTimePicker.vue';

const emit = defineEmits(["created"]);

const activityTitle = ref(null);
const activityText = ref(null);
const hasDeadline = ref(false);
var activityDeadlineDate = ref("");
var activityDeadlineTime = ref("");

function canCreateActivity() {
  let a = ((hasDeadline.value && activityDeadlineDate.value && activityDeadlineTime.value) || !hasDeadline.value)
    return activityTitle.value && a
        
}
watch (hasDeadline, () => {activityDeadlineDate.value = "", activityDeadlineTime.value=""})
function setDeadlineNow() {
    activityDeadlineDate.value = store.value.simDate.toString();
    activityDeadlineTime.value = store.value.simTime.toString().slice(0, 5);
}

function resetDeadline() {
    activityDeadlineDate.value = null;
    activityDeadlineTime.value = null;
}

function createActivity() {
    console.log("create activity");
    console.log(activityDeadlineDate.value + "AAAAA");
    console.log(activityDeadlineTime.value + "AAAASA");
   
    let simDate = store.value.simDateTime.toString().split('.')[0] + '.000Z'
    let DeadlineDate=""
    if(!activityDeadlineDate.value || !activityDeadlineTime.value){
        DeadlineDate = null
    }else{
       DeadlineDate = activityDeadlineDate.value + "T" + activityDeadlineTime.value + ":00.000Z"
    }
    console.log(simDate)
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
            deadlineDate: DeadlineDate,
            creationDate : simDate
        })
    }).then(response => {
        console.log("non ci arrivo");
        emit('created');
    });
}

</script>

<template>
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content custom-modal">
            <div class="modal-header bg-header">
                <h1 class="modal-title fs-4" id="staticBackdropLabel">
                    Create new Activity
                </h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click=""></button>
            </div>
            <div class="modal-body">
                <div class="my-2">
                    <label for="title">Title</label>
                    <input class="form-control" type="text" placeholder="Enter event title" v-model="activityTitle"
                        name="value" />
                </div>

                <div class="my-2">
                    <label>Details</label>
                    <textarea class="form-control" rows="4" placeholder="Start typing the details..."
                        v-model="activityText"></textarea>
                </div>
                <br />
                <div>

                    <label for="title">Set Deadline</label>
                    <input class="form-check-input" type="checkbox" v-model="hasDeadline"
                        name="value" />

                </div>
                <div v-if="hasDeadline">
                <div class="my-2">
                    <div>
              <input class="form-control" type="date" v-model="ActivityDeadlineDate" />
              <input class="form-control" type="time" v-model="ActivityDeadlineTime" />
                        <label class="form-check-label" for="deadline">Deadline (optional)</label>
                    </div>
                        <button class="btn btn-outline-primary" @click="setDeadlineNow()">
                            Now
                        </button>
                        <button class="btn btn-outline-danger" @click="resetDeadline()">
                            Reset
                        </button>
                </div>
                </div>
                <div class="modal-footer d-flex justify-content-end">
                    <button type="button" class="btn btn-primary" data-bs-dismiss="modal" @click="createActivity"
                        :disabled="!canCreateActivity()">
                        Create
                    </button>
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
</style>
