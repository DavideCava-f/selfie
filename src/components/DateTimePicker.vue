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

const size = 300
const center = size / 2

const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i)
const selectedYear = ref(years[0])
const months = Array.from({ length: 12 }, (_, i) => ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][i])
const selectedMonth = ref(months[0])
const days = computed(() => Array.from({ length: Temporal.PlainDate.from({ year: selectedYear.value, month: months.indexOf(selectedMonth.value) + 1, day: 1 }).daysInMonth }, (_, i) => i + 1));
const selectedDay = ref(days[0])

// 1. when any picker changes, emit a new beginDate
watch(
    [selectedYear, selectedMonth, selectedDay],
    ([y, m, d]) => {
        const monthIndex = months.indexOf(m) + 1;
        const plain = Temporal.PlainDate.from({ year: y, month: monthIndex, day: d });
        beginDate.value = plain.toString();
    },
);

// 2. when the parent gives you a new props.date, split it back into the selectors
watch(
    () => beginDate.value,
    (newDate) => {
        if (!newDate) return;
        const plain = Temporal.PlainDate.from(newDate);
        selectedYear.value = plain.year;
        selectedMonth.value = months[plain.month - 1];
        selectedDay.value = plain.day;
    },
);
</script>

<template>
    <div class="flex flex-col items-center justify-content-between align-items-center">
        <div>
            <select class="form-select" v-model="selectedYear">
                <option v-for="year in years">{{ year }}</option>
            </select>
        </div>
        <div>
            <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
                <g :transform="`translate(${center}, ${center})`">
                    <OrbitalSelector :items="months" :radius="120" color="#FDD128" v-model:selected="selectedMonth" />
                    <OrbitalSelector :items="days.slice(0, 15)" :radius="90" color="#87A96B"
                        v-model:selected="selectedDay" />
                    <OrbitalSelector :items="days.slice(15)" :radius="70" color="#87A96B"
                        v-model:selected="selectedDay" />
                </g>
            </svg>
        </div>
    </div>
</template>

<style scoped></style>
