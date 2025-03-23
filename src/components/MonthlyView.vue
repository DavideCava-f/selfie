<script setup>
import { ref, onMounted } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";
import VisualizeEvent from "@/components/VisualizeEvent.vue";
import ModifyEvent from "@/components/ModifyEvent.vue";

let weekdays = ref([]);
let firstDay = ref({});
let realFirstDay = ref({});
let dayInMonth = ref([]);
const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];
var activeEventId = ref("");
let SelectedDay = ref("");


async function getEvents(){
    store.value.getEventsOfMonth(firstDay.toString());

}
function reload(){
    firstDay=realFirstDay;
    store.value.monthOffset=0;
    updateWeekDays(firstDay);
    getEvents();
}

function updateWeekDays(day){
    weekdays.value = [];
    for (let i = 0; i < 7; i++) {
        weekdays.value.push(giorniSettimana[(day.add({days: i})).dayOfWeek - 1]);
    }
    dayInMonth.value = day.daysInMonth;
    console.log(firstDay.toString());
}

async function changeMonth(direction){
    if (direction === 1){
        firstDay = firstDay.add({months: 1});
        store.value.monthOffset++;
    } else {
        firstDay = firstDay.add({months: -1});
        store.value.monthOffset--;
    }
    updateWeekDays(firstDay);
    getEvents();

}

onMounted(async () => {
    console.log("Mounted MonthlyView");
    const today = Temporal.Now.plainDateISO(); // Ottiene la data odierna
    firstDay = today.with({ day: 1 }); // Imposta il giorno a 1
    console.log(firstDay.toString());
    await updateWeekDays(firstDay);
    realFirstDay = firstDay;
    await getEvents();

});

function conta(i){
    return store.value.eventsOfMonth.find((d)=> (d.day) ===i).events.length;
}

</script>

<template>
    <div class="container-fluid text-light border border-danger w-100">
        <div class="d-flex justify-content-between flex-fill bg-light text-center rounded-3">
            <button class="btn d-flex align-self-center" @click="changeMonth(-1)">
                <img src="@/assets/Indietro.svg" />
            </button>
            <div class="align-self-center text-dark">{{ firstDay.toLocaleString("it-IT", { month: "long" }) }}
            <button v-if="store.monthOffset !== 0" class="btn"
                @click="reload()">R</button>
            </div>
            <button class="btn d-flex align-self-center" @click="changeMonth(1)">
                <img src="@/assets/avanti.svg" />
            </button>
        </div>
        <div class="d-flex bg-dark flex-fill justify-content-between w-100" id="uppercalendar" > <!-- barra superiore del calendario -->
            <div v-for="day in weekdays" class="d-flex flex-fill justify-content-center border border-white" style="width: calc(100%/7); max-width: calc(100%/7);">
                    <p>{{ day }}</p>
            </div>
        </div>
        <div class="d-flex flex-wrap w-100 border border-white"> <!-- celle dei giorni nel mense -->
            <div v-for="i in dayInMonth" class="d-flex flex-column flex-fill justify-content-start border" style="width: calc(100%/7); max-width: calc(100%/7); height: 15vh">
                <div class="d-flex justify-content-center text-wrap">
                    {{ i }}
                    <span v-if="store.simDateTime.day === i" class="text-danger fs-4">*</span>
                </div>
                <div class="m-0 p-0 d-flex flex-column" style="overflow: hidden;">
                    <div v-if="store.eventsOfMonth.find((d)=> (d.day) ===i) && (conta(i)>2)">
                        <button @click="() => {
                                    activeEventId = event._id
                                }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal"
                                v-if="store.eventsOfMonth.find((d)=> (d.day) === i)" v-for="event in (store.eventsOfMonth.find((d)=> (d.day) ===i).events).slice(0,2)"
                                class="btn d-inline-block text-truncate" 
                                style="line-height: 1; max-width: 100%;min-height: 25%">
                        {{ event.title }}
                        </button>
                        <div class="btn" @click="()=>{
                            SelectedDay=store.eventsOfMonth.find((d)=> (d.day) === i);
                        }" 
                        data-bs-target="#AltriEventi" data-bs-toggle="modal"
                        style="line-height: 1; max-width: 100%;min-height: 25%">
                            altri eventi
                        </div>
                    </div>
                    <div v-else>
                        <button @click="() => {
                                    activeEventId = event._id
                                }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal"
                        v-if="store.eventsOfMonth.find((d)=> (d.day) === i)" v-for="event in store.eventsOfMonth.find((d)=> (d.day) ===i).events" class="btn d-inline-block text-truncate" style="line-height: 1; max-width: 100%;min-height: 25%">
                        {{ event.title }}
                        </button>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
    <div class="modal fade" id="VisualizeEventModal" data-bs-backdrop="false" tabindex="-1"
                    aria-hidden="true">
                    <VisualizeEvent :IdEvent="activeEventId" :isActive="isActive"/>
    </div>

    <div class="modal fade" id="AltriEventi" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title" id="exampleModalLabel">Altri eventi</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body d-flex flex-column">
                    <button v-for="event in SelectedDay.events" @click="() => {
                                    activeEventId = event._id
                    }" data-bs-target="#VisualizeEventModal" data-bs-toggle="modal" class="btn">
                        {{ event.title }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style>

</style>