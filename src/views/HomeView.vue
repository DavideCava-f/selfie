<script setup>
import { store } from "@/store";
import { ref, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Temporal } from "@js-temporal/polyfill";
import { get } from "mongoose";

let lastnote = ref({});
let nearEvents = ref([]);
let loaded = ref(Boolean);
let pomodoro = ref({});
const router = useRouter();


async function getLastNote() {
    const response = await fetch(`${store.value.url}:${store.value.port}/note/last`, {
        credentials: "include",
    });
    if (!response.ok) return;
    lastnote.value = await response.json();
}

async function getLastPomodoro() {
    const response = await fetch(`${store.value.url}:${store.value.port}/pomodoro/last`, {
        credentials: "include",
    });
    if (!response.ok) return;
    pomodoro.value = await response.json();
<<<<<<< Updated upstream
    console.log(pomodoro.value);
=======
>>>>>>> Stashed changes
}

async function update() {
    await getLastNote();
    await getNearEvents();
    await getLastPomodoro();
    loaded.value = true;
}

async function getNearEvents() {
    const max = (store.value.advance.twoWeeks[0].add(store.value.advance.twelveHr[0].add(store.value.advance.halfHr[0]))).toString();
    fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${false}&max=${max}`, {
        credentials: "include"
    })
        .then(response => {
            return response.json();
        }).then(data => {
            nearEvents.value = data.slice(0, 5);
        });
}

onBeforeMount(async () => {
    update();
});

watch(() => store.value.deltaDateTime, () => {
    update();
});

function getVisibleDate(date) {
    date = date.slice(0, -1);
    var str =
        new Date(date).toDateString() +
        " " +
        new Date(date).toTimeString().split(" ")[0];
    str = str.slice(0, -3);
    return str;
}

function getWeeklyIndex(date){
    const wday = Temporal.PlainDate.from(date).dayOfWeek;
    return wday === 0 ? 7 : wday; 
}

function ToEvent(event) {
    const d1 = Temporal.PlainDate.from(store.value.simDate);
    const d2 = Temporal.PlainDate.from(event.dates[0].begin.slice(0, 10));
    const i1 = getWeeklyIndex(store.value.simDate);
    const i2 = getWeeklyIndex(event.dates[0].begin.slice(0, 10));

    console.log("i1: " + i1 + " i2: " + i2);

    const diff = d2.since(d1);
<<<<<<< Updated upstream
    store.value.weekOffset = Math.floor(diff.days / 7);
    if(store.value.weekOffset === 0 && i2 < i1){
        store.value.weekOffset = 1; 
    } 
=======
    store.value.weekOffset+= Math.floor(diff.days / 7);
>>>>>>> Stashed changes
    router.push('/calendar');
}

</script>

<template>
    <div class="container-fluid">
        <div class="row justify-content-center p-3 ">
            <div class="col-lg-3 col-12 animate-card-downward"><!-- colonna prossimi eventi -->

                <div class="card text-bg-danger mb-3" style="max-height: 80vh;">
                    <div class="card-header d-flex align-items-center ">
                        <h2 class="mx-auto">Eventi prossimi</h2>
                    </div>
                    <div class="card-body overflow-scroll rounded-4 overflow-x-hidden align-items-center">
                        <div v-if="nearEvents.length == 0">
                            <h1>Non ci sono eventi prossimi</h1>
                        </div>
                        <div v-else>
                            <button v-for="event in nearEvents" @click="ToEvent(event)"
                                class="w-100 btn bg-success rounded-3 text-black my-1 align-items-center">
                                <h2>{{ event.title }}</h2>
                                {{ event.details.text }}
                                <div class="d-flex justify-content-center">
                                    <table class="table-success">
                                        <thead>
                                            <tr>
                                                <th scope="col">Start</th>
                                                <th scope="col">End</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td>{{ getVisibleDate(event.dates[0].begin) }}</td>
                                                <td>{{ getVisibleDate(event.dates[0].end) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-12 animate-card-upward"><!-- colonna ultima nota -->

                <div class="card text-bg-danger mb-3" style="max-height: 80vh;">
                    <div class="card-header d-flex align-items-center">
                        <h2 class="mx-auto">Ultima nota modificata</h2>
                    </div>
                    <div class="card-body overflow-scroll rounded-4 overflow-x-hidden align-items-center ">
                        <button @click="router.push('/notes');" class="w-100 btn bg-success rounded-3 text-black my-1">
                            <h1 v-if="loaded">
                                {{ lastnote?.Title }}
                            </h1>
                            <h1 v-else>
                                caricamento in corso...
                            </h1>
                            <p v-if="loaded">
                                {{ lastnote?.Text }}
                            </p>
                            <p v-else>
                                caricamento in corso...
                            </p>

                        </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-12 animate-card-downward">
                <div class="card text-bg-danger mb-3" style="max-height: 80vh;">
                    <div class="card-header d-flex align-items-center justify-content-center text-center">
                        <h1 class="mx-auto">Utlimo pomodoro completato</h1>
                    </div>
                    <div class="card-body overflow-scroll rounded-4 overflow-x-hidden align-items-center">
                        <div v-if="!pomodoro.value" class="rounded" style="background-color: #f383a5;">
                            <div class="row g-0 text-dark">
                                <div class="col-12 d-flex flex-column align-items-center">
                                    Durata
                                </div>
                                <div class="col-6 d-flex flex-column align-items-center ">
                                    <h4>
                                        Studio
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-book" viewBox="0 0 16 16">
                                            <path
                                                d="M1 2.828c.885-.37 2.154-.769 3.388-.893 1.33-.134 2.458.063 3.112.752v9.746c-.935-.53-2.12-.603-3.213-.493-1.18.12-2.37.461-3.287.811zm7.5-.141c.654-.689 1.782-.886 3.112-.752 1.234.124 2.503.523 3.388.893v9.923c-.918-.35-2.107-.692-3.287-.81-1.094-.111-2.278-.039-3.213.492zM8 1.783C7.015.936 5.587.81 4.287.94c-1.514.153-3.042.672-3.994 1.105A.5.5 0 0 0 0 2.5v11a.5.5 0 0 0 .707.455c.882-.4 2.303-.881 3.68-1.02 1.409-.142 2.59.087 3.223.877a.5.5 0 0 0 .78 0c.633-.79 1.814-1.019 3.222-.877 1.378.139 2.8.62 3.681 1.02A.5.5 0 0 0 16 13.5v-11a.5.5 0 0 0-.293-.455c-.952-.433-2.48-.952-3.994-1.105C10.413.809 8.985.936 8 1.783" />
                                        </svg>
                                    </h4>
                                    <p>{{ pomodoro.studyMins }} {{ pomodoro.studyMins > 1 ? "minuti" : "minuto" }}</p>
                                </div>
                                <div class="col-6 d-flex flex-column align-items-center">
                                    <h4>
                                        Pausa
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-pause-fill" viewBox="0 0 16 16">
                                            <path
                                                d="M5.5 3.5A1.5 1.5 0 0 1 7 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5m5 0A1.5 1.5 0 0 1 12 5v6a1.5 1.5 0 0 1-3 0V5a1.5 1.5 0 0 1 1.5-1.5" />
                                        </svg>
                                    </h4>
                                    <p>{{ pomodoro.pauseMins }} {{ pomodoro.pauseMins > 1 ? "minuti" : "minuto" }}</p>
                                </div>
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <h4>
                                        cicli
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                            fill="currentColor" class="bi bi-arrow-counterclockwise"
                                            viewBox="0 0 16 16">
                                            <path fill-rule="evenodd"
                                                d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2z" />
                                            <path
                                                d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466" />
                                        </svg>
                                    </h4>
                                    <p>{{ pomodoro.cycles }} {{ pomodoro.cycles > 1 ? "Cicli" : "Ciclo" }}</p>
                                </div>
                                <div class="col-12 d-flex flex-column align-items-center">
                                    <h4>
                                        Totale pomodoro:
                                    </h4>
                                    <p>{{ (pomodoro.studyMins + pomodoro.pauseMins) * pomodoro.cycles }} {{
                                        (pomodoro.studyMins + pomodoro.pauseMins) *pomodoro.cycles > 1 ? "minuti":
                                        "minuto" }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-else>
                            Non è ancora stato completato nessun pomodoro
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg {
    background-color: rgb(252, 114, 109);
}

.animate-card-downward {
    opacity: 0;
    transform: translateY(-100%);
    animation: slideIn 0.7s ease-out forwards;
}

.animate-card-upward {
    opacity: 0;
    transform: translateY(100%);
    animation: slideIn 0.7s ease-out forwards;
}

@media (max-width: 480px) {
    .animate-card-downward {
        transform: translateX(-100%);
    }

    .animate-card-upward {
        transform: translateX(100%);
    }
}

@keyframes slideIn {
    to {
        transform: translateX(0);
        opacity: 1;
    }
}
</style>
