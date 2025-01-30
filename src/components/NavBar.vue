<script setup>
import { computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const currentRoute = computed(() => router.currentRoute.value["path"]);

</script>


<template>
    <div class="container-fluid bg-danger">
        <div class="row g-0 d-flex justify-content-between">
            <div class="col-1 my-1">
                <button class="btn btn-primary navbar-toggler d-md-none" type="button" data-bs-toggle="collapse" data-bs-target="#navbar"
                    aria-expanded="false" aria-controls="navbar">
                    <img src="@/assets/HamburgerLogo.svg" alt="Menu" class="w-100">
                </button>
            </div>

            <div class="col-10 d-flex justify-content-center my-1">
                <div class="d-md-flex" id="navbar">
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
                            <RouterLink v-if="currentRoute !== '/projects' "class="nav-link text-white" to="/projects">
                                <img src="@/assets/ProjectLogo.svg" alt="Projects" width="w-100">
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <!-- Non sara' un RouterLink -->
                            <RouterLink class="nav-link text-white" to="#">
                                <img src="@/assets/PomodoroLogo.svg" alt="Pomodoro" class="w-100">
                            </RouterLink>
                        </li>
                        <li class="nav-item">
                            <!-- Non sara' un RouterLink -->
                            <RouterLink class="nav-link text-white" to="#">
                                <img src="@/assets/TimeMachineLogo.svg" alt="TimeMachine" class="w-100">
                            </RouterLink>
                        </li>
                    </ul>
                </div>
            </div>

            <div class="col-1 my-1 me-0">
                <img src="https://dummyimage.com/100x100/ffff00/000000.png&text=USSR" class="rounded" width="41vh">
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>

