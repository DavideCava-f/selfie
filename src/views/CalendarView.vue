<script setup>
import { ref, onMounted } from "vue";
import NavBar from '@/components/NavBar.vue';
import CreateEvent from "@/components/CreateEvent.vue";
import VisualizeEvent from "@/components/VisualizeEvent.vue";
import ModifyEvent from "@/components/ModifyEvent.vue";
import DeleteEvent from "@/components/DeleteEvent.vue";
import { store } from '@/store';
import { Temporal } from "@js-temporal/polyfill";
import MonthlyView from "@/components/MonthlyView.vue";
import WeeklyView from "@/components/WeeklyView.vue";
import DailyView from "@/components/DailyView.vue";

const isWeekly = ref(Boolean);

onMounted();
</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
    <div class="container-fluid">
        <div class="row bg-dark p-3 h-100" style="">
            <div class="col-lg-4 col-12 order-2 order-lg-1 mt-3 bg-warning rounded-4">
                <!-- colonna day-->
                <DailyView />
            </div>
            <div class="col-lg-8 col-12 order-1 order-lg-2 mt-3 bg-primary rounded-4" style="position: relative">
                <!-- colonna calendario -->
                <div>
                    <button class="btn" @click="isWeekly = true">
                        Weekly
                    </button>
                    <button class="btn" @click="isWeekly = false">
                        Monthly
                    </button>
                </div>
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
        <CreateEvent />
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

<style scoped></style>
