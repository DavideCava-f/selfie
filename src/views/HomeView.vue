<script setup>
import NavBar from "@/components/NavBar.vue";
import { store } from "@/store";
import { ref, onBeforeMount, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

let lastnote = ref({});
let nearEvents = ref([]);
let loaded = ref(Boolean);
let pomodoro = ref({});
const router = useRouter();


function getLastNote() {
    fetch(`${store.value.url}:${store.value.port}/note/last`, {
        credentials: "include",
    })
        .then(response => {
            //console.log(response);
            return response.json();
        }).then(data => {
            console.log(data);
            lastnote.value = data;
        });
}

async function update() {
    await getLastNote();
    await getNearEvents();
    console.log(lastnote.value);
    loaded.value = true;
}

async function getNearEvents() {
    console.log("suca");
    const max = (store.value.advance.twoWeeks[0].add(store.value.advance.twelveHr[0].add(store.value.advance.halfHr[0]))).toString();
    fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}&isNotification=${false}&max=${max}`)
        .then(response => {
            //console.log(response);
            return response.json();
        }).then(data => {
            console.log("Near Eventssss:");
            console.log(data);
            nearEvents.value = data.slice(0, 5);
        });
}

onBeforeMount(async () => {
    update();
});

watch(() => store.value.deltaDateTime, () => {
    update();
});

function gotoNote() {
    console.log("gotoNote");
    router.push("/notes");
}

function getVisibleDate(date) {
    date = date.slice(0, -1);
    var str =
        new Date(date).toDateString() +
        " " +
        new Date(date).toTimeString().split(" ")[0];
    str = str.slice(0, -3);
    console.log(str);
    return str;
}

</script>

<template>
    <NavBar />
    <div class="container-fluid">
        <div class="row justify-content-center p-3 " >
            <div class="col-lg-3 col-12 "><!-- colonna prossimi eventi -->

                <div class="card text-bg-danger mb-3" style="max-height: 80vh;">
                    <div class="card-header align-items-center">
                        <h2 class="mx-auto">Eventi prossimi</h2>
                    </div>
                    <div class="card-body overflow-scroll rounded-4 overflow-x-hidden align-items-center">
                        <div v-if="nearEvents.length == 0">
                            <h1>Non ci sono eventi prossimi</h1>
                        </div>
                        <div v-else>
                            <button v-for="event in nearEvents" @click="router.push('/calendar')"
                                class="w-100 btn bg-success rounded-3 text-black my-1 justify-content-start">
                                <h2>{{ event.title }}</h2>
                                {{ event.details.text }}
                                <h3>ripetizioni:</h3>
                                <table class="table-success ">
                                    <thead>
                                    <tr>
                                        <th scope="col">Start</th>
                                        <th scope="col">End</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="date in event.dates" :key="date.begin">
                                        <td>{{ getVisibleDate(date.begin) }}</td>
                                        <td>{{ getVisibleDate(date.end) }}</td>
                                    </tr>
                                    </tbody>
                                </table>
                                <!-- <div v-for="date in event.dates">
                                    <p>{{ getVisibleDate(date.begin) }}</p>
                                    <p>{{ getVisibleDate(date.end) }}</p>
                                </div> -->
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-12"><!-- colonna ultima nota -->

                <div class="card text-bg-danger mb-3" style="max-height: 80vh;">
                    <div class="card-header align-items-center">
                        <h2 class="mx-auto">Ultima nota modificata</h2>
                    </div>
                    <div class="card-body overflow-scroll rounded-4 overflow-x-hidden align-items-center">
                        <button @click="gotoNote" class="btn bg-success rounded-3 text-black m-2">
                        <h1 v-if="loaded">
                            {{ lastnote.Title }}
                        </h1>
                        <h1 v-else>
                            caricamento in corso...
                        </h1>
                        <p v-if="loaded">
                            {{ lastnote.Text }}
                        </p>
                        <p v-else>
                            caricamento in corso...
                        </p>

                    </button>
                    </div>
                </div>
            </div>
            <div class="col-lg-3 col-12">
                <div class="card text-bg-danger mb-3" style="max-height: 80vh;">
                    <div class="card-header align-items-center">
                        <h2 class="mx-auto">Progetti in corso</h2>
                    </div>
                    <div class="card-body overflow-scroll rounded-4 overflow-x-hidden align-items-center">
                        <div v-if="pomodoro.value">

                        </div>
                        <div v-else>
                            Non ci sono progetti in corso
                        </div>
                    </div>
                </div>


                <!-- <div class="align-items-center">
                    <h2 class="mx-auto">Report ultimo pomodoro</h2>
                </div>
                <div class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4"
                    style="max-height: 80vh">
                    <div class="bg-success rounded-3 text-black m-2">
                        <div v-if="pomodoro.value">

                        </div>
                        <div v-else>
                            Nessun pomodoro fatto
                        </div>

                    </div>
                </div> -->
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg {
    background-color: rgb(252, 114, 109);
}
</style>
