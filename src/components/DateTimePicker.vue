<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { store } from "@/store";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { Temporal } from "@js-temporal/polyfill";
import OrbitalSelector from './OrbitalSelector.vue'

const props = defineProps(["date", "time"]);
const emit = defineEmits(["update:date", "update:time"]);

const beginDate = computed({
    get: () => props.date,
    set: value => emit("update:date", value)
});

const beginTime = computed({
    get: () => props.time,
    set: value => emit("update:time", value)
});

var Day = ref(store.value.simDate.day)
var DayArray = ref(getArrayToN(30, store.value.simDate.day, 0))//Giorni nel mese avanti ad ora
var YearArray = ref(getArrayToN(10, 0, store.value.simDate.year))
var MonthArray = ref(getArrayToN(12, store.value.simDate.month, 0))
var Month = ref(store.value.simDate.month)
var Year = ref(store.value.simDate.year)
var Minutes = ref(store.value.simDateTime.minute)
var MinutesArray = ref(getArrayToN(60, store.value.simDateTime.minute, 0))
var Hours = ref(store.value.simDateTime.hour)
var HoursArray = ref(getArrayToN(24, store.value.simDateTime.hour, 0))


function getArrayToN(N, min, offset) { //Funzione Generica
    var array = [];
    for (let i = min; i <= N; i++) {
        array.push(i + offset);
    }
    return array
}

function fillMinutesArray() {
    console.log(store.value.simDateTime.hour)
    console.log(Hours.value)
    var array = [];
    if (Month.value == store.value.simDate.month && Year.value == store.value.simDate.year && Day.value == store.value.simDate.day && Hours.value == store.value.simDateTime.hour) {
        array = getArrayToN(60, store.value.simDateTime.minute, 0)
    } else {
        array = getArrayToN(60, 1, 0)
    }
    MinutesArray.value = array
}

function fillHourArray() {
    console.log(store.value.simDateTime)
    var array = [];
    if (Month.value == store.value.simDate.month && Year.value == store.value.simDate.year && Day.value == store.value.simDate.day) {
        array = getArrayToN(24, store.value.simDateTime.hour, 0)
    } else {
        array = getArrayToN(24, 1, 0)
    }
    HoursArray.value = array
}

function fillDayArray() {
    console.log(store.value.simDateTime)
    var array = [];
    if (Month.value == store.value.simDate.month && Year.value == store.value.simDate.year) {
        array = getArrayToN(30, store.value.simDate.day, 0)
    } else {
        array = getArrayToN(30, 1, 0)
    }
    DayArray.value = array
}

function fillMonthArray() {
    var array = [];
    if (Year.value == store.value.simDate.year) {
        array = getArrayToN(12, store.value.simDate.month, 0)
    } else {
        array = getArrayToN(12, 1, 0)
    }
    MonthArray.value = array
}

watch(Hours, fillMinutesArray)
watch(Day, fillMinutesArray)
watch(Day, fillHourArray)

watch(Month, fillMinutesArray)
watch(Month, fillHourArray)
watch(Month, fillDayArray)

watch(Year, fillMinutesArray)
watch(Year, fillHourArray)
watch(Year, fillDayArray)
watch(Year, fillMonthArray)

const size = 400
const center = size / 2

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)
const selectedYear = ref(years[0])
const months = Array.from({ length: 12 }, (_, i) => i + 1)
const selectedMonth = ref(months[0])
const days = computed(() => Array.from({ length: Temporal.PlainDate.from({ year: selectedYear.value, month: months.indexOf(selectedMonth.value) + 1, day: 1 }).daysInMonth }, (_, i) => i + 1));
const selectedDay = ref(days[0])
</script>

<template>
    <div class="flex flex-col items-center">
        <div>
            <select v-model="selectedYear">
                <option v-for="year in years">{{ year }}</option>
            </select>
        </div>
        <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
            <g :transform="`translate(${center}, ${center})`">
                <OrbitalSelector :items="months" :radius="150" v-model:selected="selectedMonth" />
                <OrbitalSelector :items="days" :radius="100" v-model:selected="selectedDay" />
            </g>
        </svg>

        <div class="mt-4 text-center">
            Selezionati:<br>
            Year: <strong>{{ selectedYear }}</strong><br>
            Month: <strong>{{ selectedMonth }}</strong><br>
            Day: <strong>{{ selectedDay }}</strong>
        </div>
    </div>
    <!-- <span> -->
    <!--     <select v-model="Day"> -->
    <!--         <option v-for="n in DayArray" :key="n" :value="n">{{ n }}</option> -->
    <!--     </select> -->
    <!--     / -->
    <!--     <select v-model="Month"> -->
    <!--         <option v-for="n in MonthArray" :key="n" :value="n">{{ n }}</option> -->
    <!--     </select> -->
    <!--     / -->
    <!--     <select v-model="Year"> -->
    <!--         <option v-for="n in YearArray" :key="n" :value="n">{{ n }}</option> -->
    <!--     </select> -->
    <!--     | -->
    <!--     <select v-model="Hours"> -->
    <!--         <option v-for="n in HoursArray" :key="n" :value="n">{{ n }}</option> -->
    <!--     </select> -->
    <!--     : <select v-model="Minutes"> -->
    <!--         <option v-for="n in MinutesArray" :key="n" :value="n">{{ n }}</option> -->
    <!--     </select> -->
    <!-- </span> -->
</template>

<style scoped></style>
