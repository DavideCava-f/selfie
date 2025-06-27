<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { store } from "@/store";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";
import { Temporal } from "@js-temporal/polyfill";
import OrbitalSelector from './OrbitalSelector.vue'

const props = defineProps(["date", "time", "min"]);
const emit = defineEmits(["update:date", "update:time"]);

const beginDate = computed({
    get: () => props.date,
    set: value => emit("update:date", value)
});

const beginTime = computed({
    get: () => props.time,
    set: value => emit("update:time", value)
});

const selectedYear = computed(() => beginDate.value ? Temporal.PlainDate.from(beginDate?.value).year : new Date().getFullYear())

const size = 300
const center = size / 2

const months = Array.from({ length: 12 }, (_, i) => ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"][i])
const selectedMonth = ref(months[0])
const days = computed(() => Array.from({ length: Temporal.PlainDate.from({ year: selectedYear.value, month: months.indexOf(selectedMonth.value) + 1, day: 1 }).daysInMonth }, (_, i) => i + 1));
const selectedDay = ref(days[0])

const hours = Array.from({ length: 24 }, (_, i) => (i + 12) % 24)
const selectedHour = ref(hours[0])
const minutes = Array.from({ length: 12 }, (_, i) => i * 5)
const selectedMinute = ref(minutes[0])

watch(
    [selectedYear, selectedMonth, selectedDay],
    ([y, m, d]) => {
        const monthIndex = months.indexOf(m) + 1;
        const plain = Temporal.PlainDate.from({ year: y, month: monthIndex, day: d });
        beginDate.value = plain.toString();
    },
);

watch(
    () => beginDate.value,
    (newDate) => {
        if (!newDate) return;
        const plain = Temporal.PlainDate.from(newDate);
        selectedMonth.value = months[plain.month - 1];
        selectedDay.value = plain.day;
    },
);

watch(
    [selectedHour, selectedMinute],
    ([h, m]) => {
        const plain = Temporal.PlainTime.from({ hour: h, minute: m });
        beginTime.value = plain.toString();
    },
);

watch(
    () => beginTime.value,
    (newTime) => {
        if (!newTime) return;
        const plain = Temporal.PlainTime.from(newTime);
        selectedHour.value = plain.hour;
        selectedMinute.value = plain.minute;
    },
);
</script>

<template>
    <div class="d-flex flex-row justify-content-lg-between justify-content-center align-items-center flex-wrap gap-2">
        <div>
            <div>
                <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
                    <g :transform="`translate(${center}, ${center})`">
                        <OrbitalSelector :items="months" :radius="120" color="#FDD128"
                            v-model:selected="selectedMonth" />
                        <OrbitalSelector :key="`first-${selectedYear}-${selectedMonth}`" :items="days.slice(0, 18)"
                            :radius="90" color="#87A96B" v-model:selected="selectedDay" />
                        <OrbitalSelector :key="`second-${selectedYear}-${selectedMonth}`" :items="days.slice(18)"
                            :radius="60" color="#87A96B" v-model:selected="selectedDay" />
                    </g>
                </svg>
            </div>
            <div>
                <input class="form-control" type="date" v-model="beginDate" />
            </div>
        </div>
        <div>
            <div>
                <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
                    <g :transform="`translate(${center}, ${center})`">
                        <OrbitalSelector :items="hours" :radius="120" color="#BC544B" v-model:selected="selectedHour" />
                        <OrbitalSelector :items="minutes" :radius="60" color="#87A96B"
                            v-model:selected="selectedMinute" />
                    </g>
                </svg>
            </div>
            <div>
                <input class="form-control" type="time" v-model="beginTime" />
            </div>
        </div>
    </div>
</template>

<style scoped></style>
