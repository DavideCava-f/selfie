<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";
import { getEventsOfMonth } from "@/eventGetter";
import { getActivitiesOfMonth } from "@/activityGetter";
import { getPomodoros } from "@/pomodoroGetter";
import VisualizeEvent from "@/components/VisualizeEvent.vue";
import ModifyEvent from "@/components/ModifyEvent.vue";
import ActivityModal from "@/components/ActivityModal.vue";

let weekdays = ref([]);
let firstDay = computed(() => store.value.simDate.with({ day: 1 }).add({ months: store.value.monthOffset }));
let dayInMonth = ref([]);
const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
// var MactiveEventId = ref("");
let eventsOfSelectedDay = ref({});
const activitiesOfSelectedDay = ref({});

function reload() {
    store.value.monthOffset = 0;
    updateWeekDays(firstDay.value);
}

function updateWeekDays(day) {
    weekdays.value = [];
    for (let i = 0; i < 7; i++) {
        weekdays.value.push(giorniSettimana[(day.add({ days: i })).dayOfWeek - 1]);
    }
    dayInMonth.value = day.daysInMonth;
    console.log(firstDay.toString());
}

async function changeMonth(direction) {
    store.value.monthOffset += direction;
    updateWeekDays(firstDay.value);
}

function conta(i) {
    return store.value.eventsOfMonth.find((d) => (d.day) === i).events.length;
}

function getColorFromTitle(title) {
    // Create a hash from the title string
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Convert the hash to an RGB color
    let color = '#';
    for (let i = 0; i < 3; i++) {
        // Extract 8 bits at a time from the hash
        const value = (hash >> (i * 8)) & 0xFF;
        // Convert the value to a two-digit hexadecimal string
        color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
}

function getInvertedColor(hex) {
    // Remove '#' if present
    hex = hex.replace(/^#/, '');

    // If shorthand notation, expand it (e.g., "abc" -> "aabbcc")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Validate hex color length
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }

    // Convert hex to RGB components
    let r = parseInt(hex.substring(0, 2));
    let g = parseInt(hex.substring(2, 4));
    let b = parseInt(hex.substring(4, 6));

    // Invert each color component
    r = 255 - r;
    g = 255 - g;
    b = 255 - b;

    // Convert the inverted values back to hex and return the result
    return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

onMounted(async () => {
    console.log("Mounted MonthlyView");
    console.log(firstDay.toString());
    updateWeekDays(firstDay.value);
    getEventsOfMonth();
    getActivitiesOfMonth();
    getPomodoros();
});

watch(() => store.value.monthOffset, () => getEventsOfMonth());
watch(() => store.value.monthOffset, () => getActivitiesOfMonth());
watch(() => store.value.monthOffset, () => getPomodoros());
</script>

<template>
    <div class="container-fluid text-light border border-danger w-100 p-0 m-0">
        <div class="d-flex justify-content-between flex-fill bg-light text-center rounded-3 align-items-center">
            <!-- barra superiore del calendario -->
            <button class="btn d-flex align-self-center" @click="changeMonth(-1)">
                <img src="@/assets/Indietro.svg" />
            </button>
            <div class="align-self-center text-dark">{{ firstDay.toLocaleString("it-IT", {
                month: "long", year:
                    "numeric"
            }) }}
                <button v-if="store.monthOffset !== 0" class="btn" @click="reload()">R</button>
            </div>
            <button class="btn d-flex align-self-center" @click="changeMonth(1)">
                <img src="@/assets/avanti.svg" />
            </button>
        </div>
        <div class="d-flex bg-dark flex-fill justify-content-between w-100" id="uppercalendar">
            <!-- barra dei giorni del calendario -->
            <div v-for="day in weekdays" class="d-flex flex-fill justify-content-center border border-white"
                style="width: calc(100%/7); max-width: calc(100%/7);">
                <p>{{ day }}</p>
            </div>
        </div>
        <div class="d-flex flex-wrap w-100 border border-white m-0"> <!-- celle dei giorni nel mense -->
            <div v-for="i in dayInMonth" class="d-flex flex-column flex-fill justify-content-start border"
                style="width: calc(100%/7); max-width: calc(100%/7); height: 15vh">
                <div class="d-flex flex-row justify-content-between align-items-center">
                    <div
                        :class="['d-flex', 'justify-content-center', 'align-items-center', 'text-wrap', 'flex-fill', 'h-100', store.simDateTime.day === i && store.monthOffset === 0 ? 'bg-danger' : '']">
                        {{ i }}
                    </div>
                    <button v-if="store.activitiesOfMonth.find((d) => d.day === i)"
                        class="btn rounded-5 bg-danger w-25 h-25 fs-100"
                        @click="activitiesOfSelectedDay = store.activitiesOfMonth.find((d) => d.day === i).activities; console.log(activitiesOfSelectedDay)"
                        data-bs-target="#VisualizeActivitiesModal" data-bs-toggle="modal">
                        A
                    </button>
                </div>
                <div class="mx-0 mt-1 p-0 d-flex flex-column" style="overflow: hidden;">
                    <div v-if="store.eventsOfMonth.find((d) => (d.day) === i) && (conta(i) > 2)"
                        class="d-flex flex-column align-items-start " style="overflow: hidden;">
                        <button @click="() => {
                            store.activeEventId = event._id; store.toggle = !store.toggle;
                            store.activeDate = firstDay.add({ days: i - 1 });
                            console.log(store.activeDate);
                        }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal"
                            v-if="store.eventsOfMonth.find((d) => (d.day) === i)"
                            v-for="event in (store.eventsOfMonth.find((d) => (d.day) === i).events).slice(0, 2)"
                            class="btn d-flex d-inline-block align-items-center  text-truncate event text-nowrap"
                            :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
                            {{ event.title }}
                        </button>
                        <button class="btn event d-flex d-inline-block align-self-center align-items-center text-nowrap"
                            @click="() => {
                                eventsOfSelectedDay = store.eventsOfMonth.find((d) => (d.day) === i).events;
                            }" data-bs-target="#AltriEventi" data-bs-toggle="modal">
                            altri eventi
                        </button>

                    </div>
                    <div v-else>
                        <button @click="() => {
                            store.activeEventId = event._id; store.toggle = !store.toggle;
                            store.activeDate = firstDay.add({ days: i - 1 });
                            console.log(store.activeDate);
                        }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal"
                            v-if="store.eventsOfMonth.find((d) => (d.day) === i)"
                            v-for="event in store.eventsOfMonth.find((d) => (d.day) === i).events" class="btn d-flex d-inline-block align-items-center 
                            text-truncate event text-nowrap"
                            :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
                            {{ event.title }}
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <!-- <div class="modal fade" id="VisualizeEventModalM" data-bs-backdrop="false" tabindex="-1" aria-hidden="true"> -->
    <!--     <VisualizeEvent /> -->
    <!-- </div> -->

    <div class="modal fade" id="AltriEventi" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Altri eventi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column">
                    <button v-for="event in eventsOfSelectedDay" @click="() => {
                        store.activeEventId = event._id; store.toggle = !store.toggle;
                    }" data-bs-target="#VisualizeEventModalM" data-bs-toggle="modal" class="btn"
                        :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
                        {{ event.title }}
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class="modal fade" id="VisualizeActivitiesModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <ActivityModal :activities="activitiesOfSelectedDay" />
    </div>
</template>

<style>
.event {
    line-height: 1;
    max-width: 100%;
    min-height: 25%
}
</style>
