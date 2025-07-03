<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";
import { getEventsOfMonth } from "@/eventGetter";
import { getActivitiesOfMonth } from "@/activityGetter";
import { getPomodoros } from "@/pomodoroGetter";
import Create from "@/components/Create.vue";
import ActivityModal from "@/components/ActivityModal.vue";

let weekdays = ref([]);
let firstDay = computed(() => store.value.simDate.with({ day: 1 }).add({ months: store.value.monthOffset }));
let dayInMonth = ref([]);
const giorniSettimana = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
// var MactiveEventId = ref("");
let selectedDay = ref(null);
let eventsOfSelectedDay = ref({});
const activitiesOfSelectedDay = ref({});
let DayNewEvent = ref(store.value.simDate);


function updateWeekDays(day) {
    weekdays.value = [];
    for (let i = 0; i < 7; i++) {
        weekdays.value.push(giorniSettimana[(day.add({ days: i })).dayOfWeek - 1]);
    }
    dayInMonth.value = day.daysInMonth;
}

async function changeMonth(direction) {
    store.value.monthOffset += direction;
    updateWeekDays(firstDay.value);
}

function conta(i) {
    let f = store.value.eventsOfMonth.find((d) => (d.day) === i);
    return f ? f.events.length : 0;
}

function contaPom(i) {
    return store.value.pomodoros.filter((p) => Temporal.PlainDate.compare(Temporal.PlainDate.from(p.beginDate.slice(0, -1)), firstDay.value.add({ days: i - 1 })) === 0).length;
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
    const clean = hex.replace(/^#/, '');
    const bigint = parseInt(clean, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    const luminance =  0.299 * r + 0.587 * g + 0.114 * b;
    luminance <128 ? hex = '#ffffff' : hex = '#000000';
    return hex;
}

onMounted(async () => {
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
            <div class="d-flex flex-row justify-content-center align-items-center w-100">
                <div class="align-self-center text-dark">
                    {{
                        (firstDay.toLocaleString("en-EN", { month: "long", year: "numeric" })).charAt(0).toUpperCase() +
                        firstDay.toLocaleString("en-EN", { month: "long", year: "numeric" }).slice(1)
                    }}
                </div>
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
                data-bs-target="#CreateEV" data-bs-toggle="modal" @click="() => {
                    DayNewEvent = firstDay.toString().slice(0, firstDay.toString().lastIndexOf('-') + 1) + i.toString().padStart(2, '0')
                }" style="width: calc(100%/7); max-width: calc(100%/7); height: 15vh">
                <div class="d-flex flex-row justify-content-between align-items-center m-0 h-25">
                    <div
                        :class="['d-flex', 'justify-content-center', 'align-items-center', 'text-wrap', 'flex-fill', 'h-100', 'z-0', store.simDateTime.day === i && store.monthOffset === 0 ? 'bg-dark' : '']">
                        {{ i }}

                    </div>
                    <button v-if="store.activitiesOfMonth.find((d) => d.day === i)"
                        class="btn bg-danger activity-button d-flex d-inline-block align-items-center justify-content-center"
                        @click="activitiesOfSelectedDay = store.activitiesOfMonth.find((d) => d.day === i).activities; "
                        data-bs-target="#VisualizeActivitiesModal" data-bs-toggle="modal">
                        <img src="@/assets/ActivityLogo.svg" alt="Activities" width="w-100">
                    </button>
                </div>
                <div class="mx-0 mt-1 p-0 d-flex flex-column" style="overflow: hidden;">
                    <div v-if="conta(i) + contaPom(i) > 2" class="d-flex flex-column align-items-start " style="overflow: hidden;">
                        <button @click="() => {
                            store.activeEventId = event._id; store.toggle = !store.toggle;
                            store.activeDate = firstDay.add({ days: i - 1 });
                        }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal"
                            v-if="store.eventsOfMonth.find((d) => (d.day) === i)"
                            v-for="event in (store.eventsOfMonth.find((d) => (d.day) === i).events).slice(0, 2)"
                            class="btn d-flex d-inline-block align-items-center  text-truncate event text-nowrap"
                            :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
                            {{ event.title }}
                        </button>
                        <button v-if="contaPom(i)>0 && (conta(i)<=1 )" v-for="pomodoro in store.pomodoros.filter((p) => Temporal.PlainDate.compare(Temporal.PlainDate.from(p.beginDate.slice(0, -1)), firstDay.add({ days: i - 1 })) === 0).slice(0, 2 - (conta(i)>2 ? 2 : conta(i)))"
                            class="btn btn-danger d-flex d-inline-block align-items-center text-truncate event text-nowrap"
                            @click="store.activePomodoro = pomodoro" data-bs-target="#PomodoroEventModal"
                            data-bs-toggle="modal"
                            :style="{'font-size': '100%',}">
                            <span>🍅</span> <span class="d-none d-sm-block">{{ pomodoro.beginDate.split("T")[1].slice(0, 5) }}</span>
                        </button>
                        
                        <button class="btn event d-flex d-inline-block align-self-center align-items-center text-nowrap"
                            @click="() => {
                                selectedDay = i;
                                if(conta(i) > 0)
                                    eventsOfSelectedDay = (store.eventsOfMonth.find((d) => (d.day) === i)).events;
                            }" data-bs-target="#AltriEventi" data-bs-toggle="modal">
                            Other events
                        </button>
                    </div>
                    <div v-else>
                        <button @click="() => {
                            store.activeEventId = event._id; store.toggle = !store.toggle;
                            store.activeDate = firstDay.add({ days: i - 1 });
                        }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal"
                            v-if="store.eventsOfMonth.find((d) => (d.day) === i)"
                            v-for="event in store.eventsOfMonth.find((d) => (d.day) === i).events" class="btn d-flex d-inline-block align-items-center 
                            text-truncate event text-nowrap"
                            :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
                            {{ event.title }}
                        </button>
                        <button
                            v-if="store.pomodoros.filter((p) => Temporal.PlainDate.compare(Temporal.PlainDate.from(p.beginDate.slice(0, -1)), firstDay.add({ days: i - 1 })) === 0)"
                            v-for="pomodoro in store.pomodoros.filter((p) => Temporal.PlainDate.compare(Temporal.PlainDate.from(p.beginDate.slice(0, -1)), firstDay.add({ days: i - 1 })) === 0).slice(0, 2 - conta(i))"
                            class="btn btn-danger d-flex d-inline-block align-items-center 
                            text-truncate event text-nowrap" @click="store.activePomodoro = pomodoro"
                            data-bs-target="#PomodoroEventModal" data-bs-toggle="modal">
                            <span>🍅</span> <span class="d-none d-sm-block">{{ pomodoro.beginDate.split("T")[1].slice(0, 5) }}</span>
                        </button>
                    </div>
                </div>

            </div>
        </div>
    </div>

    <div class="modal fade" id="AltriEventi" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-sm">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Other events</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column container-fluid">
                    <button v-for="event in eventsOfSelectedDay" @click="() => {
                        store.activeEventId = event._id; store.toggle = !store.toggle;
                    }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal" class="btn my-1"
                        :style="{ 'background-color': getColorFromTitle(event.title), 'font-size': '100%', 'color': getInvertedColor(getColorFromTitle(event.title)) }">
                        {{ event.title }}
                    </button>
                    <button
                        v-for="pomodoro in store.pomodoros.filter((p) =>
                            Temporal.PlainDate.compare(Temporal.PlainDate.from(p.beginDate.slice(0, -1)), firstDay.add({ days: selectedDay - 1 })) === 0)"
                        class="btn btn-danger my-1" data-bs-target="#PomodoroEventModal" data-bs-toggle="modal"
                        @click="store.activePomodoro = pomodoro; ">
                        🍅 {{ pomodoro.beginDate.split("T")[1].slice(0, 5) }}
                    </button>
                    <button class="btn btn-primary my-1" data-bs-target="#CreateEV" data-bs-toggle="modal">
                        +
                    </button>
                </div>
            </div>
        </div>
    </div>

    <div class=" modal fade" id="VisualizeActivitiesModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <ActivityModal :activities="activitiesOfSelectedDay" />
    </div>
    <div class=" modal fade" id="CreateEV" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <Create :date="DayNewEvent" />
    </div>
</template>

<style>
.event {
    line-height: 1;
    max-width: 100%;
    min-height: 25%
}

.activity-button {
    width: 20%;
    height: 100%;
    display: flex;
}
</style>
