<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import TimeMachine from './TimeMachine.vue';
import Pomodoro from './Pomodoro.vue';
import PomodoroEvent from './PomodoroEvent.vue';
import { store } from "@/store";

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value["path"]);
const pfpSrc = ref("");


async function setUserPfp() {
    const response = await fetch(`${store.value.url}:${store.value.port}/user/info`, {
        credentials: "include"
    });
    const user = await response.json();
    const username = user.name.slice(0, 3);
    pfpSrc.value = `https://dummyimage.com/100x100/ffff00/000000.png&text=${username}`;
}

async function logout() {
    const response = await fetch(`${store.value.url}:${store.value.port}/user/logout`, {
        credentials: "include"
    });
    router.push("/login");
}

async function deleteAccount() {
    const response = await fetch(`${store.value.url}:${store.value.port}/user`, {
        method: "DELETE",
        credentials: "include"
    });
    router.push("/login");
}

onMounted(() => setUserPfp());
</script>


<template>
    <div class="container-fluid " style="background: #6F0D31;">
        <div class="row g-0 d-flex justify-content-between">
            <div class="col-1 my-1 d-flex align-items-center ">
                <button class="d-flex align-self-center btn btn-primary navbar-toggler d-md-none w-100" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbar" aria-expanded="false" aria-controls="navbar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="45" height="45" fill="white" class="bi bi-list" viewBox="0 0 16 16">
                        <path fill-rule="evenodd" d="M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"/>
                    </svg>
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
                <!-- <div class="fw-light text-white d-flex align-items-center justify-content-center"
                    style="font-size: 75%;">
                    {{ store.simDate }}
                    <br>
                    {{ store.simTime }}
                </div> -->
                <div class="dropdown">
                    <img :src="pfpSrc" class="rounded dropdown-toggle" width="41vh" data-bs-toggle="dropdown">
                    <ul class="dropdown-menu">
                        <li><button class="dropdown-item" @click="logout">Logout</button></li>
                        <li><button class="dropdown-item" data-bs-target="#deleteAccountModal" data-bs-toggle="modal">Delete account</button></li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
        <div class="modal fade" id="deleteAccountModal" data-bs-backdrop="false">

    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content custom-modal">
        <div class="modal-header bg-header">
            <h1 class="modal-title fs-4" id="staticBackdropLabel">
                Are you sure?
            </h1>

            <br />
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>

        </div>
        <div class="modal-body">
            <div class="my-2">
                <strong style="color:red"> WARNING!!</strong> This action is irreversible
                <hr>

                <button class="btn btn-danger" @click="deleteAccount" data-bs-dismiss="modal">Delete Account</button>
            
            </div>
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
    <div class="modal fade" id="PomodoroEventModal" data-bs-backdrop="false" tabindex="-1"
        aria-labelledby="PomodoroEvent" aria-hidden="true">
        <PomodoroEvent />
    </div>
</template>

<style scoped></style>
