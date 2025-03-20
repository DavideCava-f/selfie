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

}

onMounted(async () => {
    console.log("Mounted MonthlyView");
    const today = Temporal.Now.plainDateISO(); // Ottiene la data odierna
    firstDay = today.with({ day: 1 }); // Imposta il giorno a 1
    console.log(firstDay.toString());
    await updateWeekDays(firstDay);
    await getEvents();

});

</script>

<template>
    <div class="container-fluid text-light border border-danger w-100">
        <div class="d-flex bg-dark flex-fill justify-content-between" id="uppercalendar">
            <button class="btn d-flex align-self-center" @click="changeMonth(-1)" >
                            <img src="@/assets/Indietro.svg" />
            </button>
            <div v-for="day in weekdays" class="d-flex flex-fill justify-content-center border border-white">
                    <p>{{ day }}</p>
            </div>
            <button class="btn d-flex align-self-end" @click="changeMonth(1)" >
                            <img src="@/assets/avanti.svg" />
            </button>
        </div>
        <div class="d-flex flex-wrap"> <!-- celle dei giorni nel mense -->
            <div v-for="i in dayInMonth" class="d-flex flex-column flex-fill justify-content-start border border-white" style="width: 14%;">
                <div>
                    <p>{{ i }}</p>
                </div>
                <div class="list-group">
                    <div v-if="store.eventsOfMonth.find((d)=> (d.day) === i)" v-for="event in store.eventsOfMonth.find((d)=> (d.day) ===i).events" class="list-group-item list-group-item-action text-dark">
                            <p>{{ event.title }}</p>
                    </div>
                </div>    
                
            </div>
        </div>
    </div>
</template>

<style>

</style>