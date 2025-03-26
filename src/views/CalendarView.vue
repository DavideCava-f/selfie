<script setup>
import { ref, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue';
import CreateEvent from "@/components/CreateEvent.vue";
import VisualizeEvent from "@/components/VisualizeEvent.vue";
import ModifyEvent from "@/components/ModifyEvent.vue";
import { store } from '@/store';
import { Temporal } from "@js-temporal/polyfill";
import MonthlyView from "@/components/MonthlyView.vue";
import WeeklyView from "@/components/WeeklyView.vue";

const isWeekly = ref(Boolean);
//const VisualizedDate = ref(store.value.simDate)
const VisualizedDate = ref({});


function f() {    // perche' il mio cognome e' frocio
    VisualizedDate.value = store.value.simDate
}

function update() {
    store.value.getEventsOfDay(store.value.simDate);
    store.value.getEventsOfWeek(store.value.simDate);
}

function getDate(i) {
    store.value.dayOffset += i;
    console.log(VisualizedDate.value.toString());
    VisualizedDate.value = VisualizedDate.value.add({ days: i });
    console.log(VisualizedDate.value.toString());
    update();
}

onMounted(() => {
    f()
    update();
});
</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
    <div class="container-fluid">
        <div class="row bg-dark p-3 h-100" style="">
            <div class="col-lg-4 col-12 order-2 order-lg-1 mt-3 bg-warning rounded-4">
                <!-- colonna day-->
                <div class="d-flex flex-column justify-content-center">
                    <div class="d-flex justify-content-between flex-fill bg-light text-center mx-1 my-3 rounded-3">
                        <button class="btn d-flex align-self-center" @click="getDate(-1)">
                            <img src="@/assets/Indietro.svg" />
                        </button>

                        <div v-if="store.dayOffset === 0" class="align-self-center">
                            TODAY {{ VisualizedDate.toString() }}
                        </div>
                        <div v-else-if="store.dayOffset === 1" class="align-self-center">
                            TOMORROW {{ VisualizedDate.toString() }}
                        </div>
                        <div v-else class="align-self-center">
                            {{ VisualizedDate.toString() }}
                        </div>
                        <button v-if="store.dayOffset !== 0" class="btn" @click="store.dayOffset = 0; f(); update();">
                            R
                        </button>
                        <button class="btn d-flex align-self-center" @click="getDate(1)">
                            <img src="@/assets/avanti.svg" />
                        </button>
                    </div>

                    <div class="overflow-scroll rounded-3" style="max-height: 100vh">
                        <div v-for="event in store.eventsOfDay" class="flex-fill bg-light m-1 p-3 rounded-3">
                            <div>
                                <button @click="store.activeEventId = event._id; console.log(store.activeEventId)"
                                    data-bs-target="#VisualizeEventModal" data-bs-toggle="modal">Visualize</button>
                                <h4>{{ event.title }}</h4>
                                {{ event.details.text }}

                                <footer>
                                    <a :href="event.details.link">LOCATION</a>
                                </footer>

                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-8 col-12 order-1 order-lg-2 mt-3 bg-primary rounded-4" style="position: relative">
                <div>
                    <button class="btn" @click="isWeekly = true">
                        Weekly
                    </button>
                    <button class="btn" @click="isWeekly = false">
                        Monthly
                    </button>
                </div>
                <!-- colonna calendario -->
                <component :is="isWeekly ? WeeklyView : MonthlyView"></component>

                <button class="btn bg-danger rounded-5 m-3" style="position: fixed; right: 0; bottom: 0"
                    data-bs-target="#createEventModal" data-bs-toggle="modal">
                    +
                </button>
                <!-- Finestra MODALE di inserimento evento -->
            </div>
        </div>
    </div>
    <div class="modal fade" id="createEventModal" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="createEventModal" aria-hidden="true">
        <CreateEvent @update="update" />
    </div>
    <div class="modal fade" id="VisualizeEventModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <VisualizeEvent />
    </div>
    <div class="modal fade" id="ModifyEventModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <ModifyEvent />
    </div>
</template>

<style scoped></style>
