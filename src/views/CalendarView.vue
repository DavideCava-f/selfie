<script setup>
import { ref } from "vue";
import NavBar from '@/components/NavBar.vue';
import CreateEvent from "@/components/CreateEvent.vue";
import { store } from '@/store';
import { Temporal } from "@js-temporal/polyfill";

// Impegni giornalieri per test
const eventsOfToday = ref([]);


async function getEventsOfDay(day) {
    const response = await fetch(`${store.value.url}:${store.value.port}/event`);
    eventsOfToday.value = (await response.json()).filter((event) => {
        return event.dates.every((date) => {
            console.log(day);
            console.log(date.begin);
            return Temporal.PlainDate.compare(Temporal.PlainDate.from(day), Temporal.PlainDate.from(date.begin.slice(0, -1))) === 0;
        });
    });
    console.log(eventsOfToday.value);
}

getEventsOfDay(store.value.simDate);

</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
    <div class="container-fluid">
        {{ store.realDateTime }}
        <br />
        {{ store.simDateTime }}
        <div class="row bg-dark p-3" style="">
            <div class="col-lg-4 col-12 mt-3 bg-warning rounded-4">
                <!-- colonna day-->
                <div class="d-flex flex-column justify-content-center">
                    <div class="d-flex justify-content-between flex-fill bg-light text-center mx-1 my-3 rounded-3">
                        <button class="btn d-flex align-self-center">
                            <img src="@/assets/Indietro.svg" />
                        </button>
                        <div class="align-self-center">TODAY</div>
                        <button class="btn d-flex align-self-center">
                            <img src="@/assets/avanti.svg" />
                        </button>
                    </div>

                    <div class="overflow-scroll rounded-3" style="max-height: 50vh">
                        <div v-for="event in eventsOfToday" class="flex-fill bg-light m-1 p-3 rounded-3">
                            <h4>{{ event.title }}</h4>
                            {{ event.details.text }}

                            <footer>
                                <a :href="event.details.link">LOCATION</a>
                            </footer>

                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-8 col-12 mt-3 bg-primary rounded-4" style="position: relative">
                <table class="table"></table>

                <button class="btn bg-danger rounded-5 m-3" style="position: absolute; right: 0; bottom: 0"
                    data-bs-target="#createEventModal" data-bs-toggle="modal">
                    +
                </button>
                <!-- Finestra MODALE di inserimento evento -->
                <div class="modal fade" id="createEventModal" data-bs-backdrop="false" tabindex="-1"
                    aria-labelledby="createEventModal" aria-hidden="true">
                    <CreateEvent />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped></style>
