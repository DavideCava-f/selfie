<script setup>
import { ref, onMounted } from "vue";
import { Temporal } from "@js-temporal/polyfill";

const blocchiEvento = ref([]);
let weekdays = ref([]);
let firstDay = ref({});
const giorniSettimana = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

function updateWeekDays(day){
    weekdays.value = [];
    for (let i = 0; i < 7; i++) {
        weekdays.value.push(giorniSettimana[(day.add({days: i})).dayOfWeek - 1]);
    }
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

});

</script>

<template>
    <div class="container-fluid text-light border border-danger">
        <div class="row bg-dark text-center">
            <button class="btn d-flex align-self-center" @click="changeMonth(-1)" style="width: 5%;">
                            <img src="@/assets/Indietro.svg" />
            </button>
            <div v-for="day in weekdays" class="col">
                    {{ day }}
            </div>
            <button class="btn d-flex align-self-center" @click="changeMonth(1)" style="width: 5%;">
                            <img src="@/assets/avanti.svg" />
            </button>
        </div>
    </div>
</template>

<style>

</style>