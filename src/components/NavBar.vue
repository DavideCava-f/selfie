<script setup>
import { ref, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TimeMachine from './TimeMachine.vue';
import Pomodoro from './Pomodoro.vue';
import { store } from "@/store";

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value["path"]);
const pfpSrc = ref("");


async function setUserPfp() {
    const response = await fetch(`${store.value.url}:${store.value.port}/user/info`);
    const user = await response.json();
    const username = user.name.slice(0, 3);
    pfpSrc.value = `https://dummyimage.com/100x100/ffff00/000000.png&text=${username}`;
}

async function logout() {
    const response = await fetch(`${store.value.url}:${store.value.port}/user/logout`);
    router.push("/login");
}

setUserPfp();
</script>


<template>
    <div class="container-fluid bg-danger">
        <div class="row g-0 d-flex justify-content-between">
            <div class="col-1 my-1">
                <button class="btn btn-primary navbar-toggler d-md-none" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <img src="@/assets/HamburgerLogo.svg" alt="Menu" class="w-100">
                </button>
            </div>

            <div class="col-10 d-flex justify-content-center my-1">
                <div class="collapse d-md-flex" id="navbar">
                    <ul class="nav d-flex flex-row justify-content-center align-items-center">
                        <li class="nav-item">
                            <RouterLink v-if="currentRoute !== '/home'" class="nav-link active text-white" to="/home">
                                <img src="@/assets/HomeLogo.svg" alt="Home" width="w-100">
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink v-if="currentRoute !== '/calendar'" class="nav-link text-white" to="/calendar">
                                <img src="@/assets/CalendarLogo.svg" alt="Calendar" width="w-100">
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink v-if="currentRoute !== '/notes'" class="nav-link text-white" to="/notes">
                                <img src="@/assets/NotesLogo.svg" alt="Notes" width="w-100">
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <RouterLink v-if="currentRoute !== '/activities'" class="nav-link text-white"
                                to="/activities">
                                <img src="@/assets/ActivityLogo.svg" alt="Activities" width="w-100">
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <!-- Non sara' un RouterLink -->
                            <button class="nav-link text-white" data-bs-target="#PomodoroModal" data-bs-toggle="modal">
                                <img src="@/assets/PomodoroLogo.svg" alt="Pomodoro" class="w-100">
                            </button>
                        </li>
                        <li class="nav-item">
                            <button class="nav-link text-white" data-bs-target="#timeMachineModal"
                                data-bs-toggle="modal">
                                <img src="@/assets/TimeMachineLogo.svg" alt="TimeMachine" class="w-100">
                            </button>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-1 my-1 me-0 d-flex justify-content-end gap-3">
                <div class="fw-light text-white d-flex align-items-center justify-content-center"
                    style="font-size: 75%;">
                    {{ store.simDate }}
                    <br>
                    {{ store.simTime }}
                </div>
                <div class="dropdown">
                    <img :src="pfpSrc" class="rounded dropdown-toggle" width="41vh" data-bs-toggle="dropdown">
                    <ul class="dropdown-menu">
                        <li><button class="dropdown-item" @click="logout">Logout</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>

    <!-- Time Machine modal -->
    <div class="modal fade" id="timeMachineModal" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="timeMachineModalLabel" aria-hidden="true">
        <TimeMachine />
    </div>
    <div class="modal fade" id="PomodoroModal" data-bs-backdrop="false" tabindex="-1" aria-labelledby="Pomodoro"
        aria-hidden="true">
        <Pomodoro />
    </div>
</template>

<style scoped></style>
