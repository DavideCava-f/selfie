<script setup>
import { ref, onMounted } from "vue";
import { Temporal } from "@js-temporal/polyfill";
import { store } from "@/store";

const blocchiEvento = ref([]);
let weekdays = ref([]);
let firstDay = ref({});
let MonthlyEvents= ref([]);
let dayInMonth = ref([]);
const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

async function getEvents(){
    store.value.getEventsOfMonth(firstDay.toString());

}

function updateWeekDays(day){
    weekdays.value = [];
    for (let i = 0; i < 7; i++) {
        weekdays.value.push(giorniSettimana[(day.add({days: i})).dayOfWeek - 1]);
    }
    dayInMonth.value = day.daysInMonth;
    console.log(firstDay.toString());
    console.log(weekdays.value);
}

async function changeMonth(direction){
    if (direction === 1){
        firstDay = firstDay.add({months: 1});
    } else {
        firstDay = firstDay.add({months: -1});
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
    await getEvents();

});

function conta(i){
    console.log("suca");
    return store.value.eventsOfMonth.find((d)=> (d.day) ===i).events.length;
}

function getOtherEvents(i){
    console.log(store.value.eventsOfMonth.find((d)=> (d.day) ===i).events);
}
</script>

<template>
    <div class="container-fluid text-light border border-danger w-100">
        <div class="d-flex bg-dark flex-fill justify-content-between w-100" id="uppercalendar"> <!-- barra superiore del calendario -->
            <div class="btn d-flex align-self-center" @click="changeMonth(-1)" >
                            <img src="@/assets/Indietro.svg" />
            </div>
            <div v-for="day in weekdays" class="d-flex flex-fill justify-content-center border border-white">
                    <p>{{ day }}</p>
            </div>
            <button class="btn d-flex align-self-end" @click="changeMonth(1)" >
                            <img src="@/assets/avanti.svg" />
            </button>
        </div>
        <div class="d-flex flex-wrap"> <!-- celle dei giorni nel mense -->
            <div v-for="i in dayInMonth" class="d-flex flex-column flex-fill justify-content-start border border-white" style="min-width: 14%;max-width: 14%;width: 14%; height: 15vh">
                <div class="d-flex justify-content-center text-wrap">
                    {{ i }}
                </div>
                <div class="m-0 p-0 d-flex flex-column" style="overflow: hidden;">
                    <div v-if="store.eventsOfMonth.find((d)=> (d.day) ===i) && (conta(i)>2)">
                        <div v-if="store.eventsOfMonth.find((d)=> (d.day) === i)" v-for="event in (store.eventsOfMonth.find((d)=> (d.day) ===i).events).slice(0,2)" class="btn d-inline-block text-truncate" style="line-height: 1; max-width: 100%;min-height: 25%">
                        {{ event.title }}
                        </div>
                        <div class="btn" @click="getOtherEvents(i)" style="line-height: 1; max-width: 100%;min-height: 25%">
                            altri eventi
                        </div>
                    </div>
                    <div v-else>
                        <div v-if="store.eventsOfMonth.find((d)=> (d.day) === i)" v-for="event in store.eventsOfMonth.find((d)=> (d.day) ===i).events" class="btn d-inline-block text-truncate" style="line-height: 1; max-width: 100%;min-height: 25%">
                        {{ event.title }}
                        </div>
                    </div>
                </div>
                
            </div>
        </div>
    </div>
</template>

<style>

</style>