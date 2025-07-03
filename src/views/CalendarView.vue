<script setup>
import { ref } from "vue";
import VisualizeEvent from "@/components/VisualizeEvent.vue";
import ModifyEvent from "@/components/ModifyEvent.vue";
import DeleteEvent from "@/components/DeleteEvent.vue";
import { store } from '@/store';
import MonthlyView from "@/components/MonthlyView.vue";
import WeeklyView from "@/components/WeeklyView.vue";
import DailyView from "@/components/DailyView.vue";
import Create from "@/components/Create.vue";

const isWeekly = ref(Boolean);

</script>

<template>
    <div class="container-fluid">
        <div class="row bg-dark p-0 h-100">
            <div id="daily" class="col-lg-3 col-12 order-2 order-lg-1 mt-3 rounded-4 border border-dark"
                style="background-color: #d16b7f;">
                <!-- colonna day-->
                <DailyView />
            </div>
            <div class="col-lg-9 col-12 order-1 order-lg-2 mt-3 rounded-4 px-lg-3 p-0 border border-dark"
                style="position: relative; background-color: #d16b7f;">
                <!-- colonna calendario -->
                <div class="p-lg-1 p-0 btn-group my-lg-0 my-1 mx-lg-0 mx-1" role="group">
                    <button @click="isWeekly = true" ref="weekButt"
                        :class="{ 'active': isWeekly, 'btn': true, 'btn-outline-dark': true }">
                        Weekly
                    </button>
                    <button @click="isWeekly = false" ref="monthButt"
                        :class="{ 'active': !isWeekly, 'btn': true, 'btn-outline-dark': true }">
                        Monthly
                    </button>
                    <button class="btn btn-outline-dark"
                        @click="isWeekly ? store.weekOffset = 0 : store.monthOffset = 0; store.dayOffset = 0;">
                        <a href="#daily">Today</a>
                    </button>
                </div>
                <component :is="isWeekly ? WeeklyView : MonthlyView"></component>
                <button
                    class="btn btn-primary rounded-circle fx-button d-flex align-items-center justify-content-center hover-div "
                    style="position:fixed; right: 10; bottom: 10; z-index: 10" data-bs-target="#createEventModal"
                    data-bs-toggle="modal">
                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor"
                        class="bi bi-plus" viewBox="0 0 16 16">
                        <path
                            d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                </button>
            </div>
        </div>
    </div>

    <div class="modal fade" id="createEventModal" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="createEventModal" aria-hidden="true">
        <Create />
    </div>

    <div class="modal fade" id="VisualizeEventModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <VisualizeEvent />
    </div>

    <div class="modal fade" id="ModifyEventModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <ModifyEvent />
    </div>

    <div class="modal fade" id="DeleteEventModal" data-bs-backdrop="false" tabindex="-1" aria-hidden="true">
        <DeleteEvent />
    </div>
</template>

<style scoped>
.fx-button {
    position: fixed;
    /* Posiziona l'elemento in modo fisso */
    bottom: 10vh;
    /* Distanza dal bordo inferiore */
    right: 15vw;
    width: 10vh;
    aspect-ratio: 1/1;
    /*Cerchio*/

}

.hover-div {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.hover-div:hover {
    transform: scale(1.05);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

a,
a:visited,
a:hover,
a:active {
    color: inherit;
    text-decoration: none;
}
</style>
