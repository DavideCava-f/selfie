<script setup>
import NavBar from "@/components/NavBar.vue";
import { store } from "@/store";
import { ref, onBeforeMount } from "vue";
import { useRouter, useRoute } from "vue-router";

let lastnote = ref({});
let nearEvents = ref([]);
let loaded = ref(Boolean);
let progetti = ref({});
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

async function getNearEvents() {
    fetch(`${store.value.url}:${store.value.port}/event/nearEvents?today=${store.value.simDateTime}`)
        .then(response => {
            //console.log(response);
            return response.json();
        }).then(data => {
            //console.log(data);
            nearEvents.value = data;
        });
}

onBeforeMount(async () => {
    await getLastNote();
    await getNearEvents();
    console.log("suca")
    console.log(lastnote.value);
    loaded.value = true;
});

function gotoNote() {
    console.log("gotoNote");
    router.push("/notes");
}

function getVisibleDate(date) {
    var str =
        new Date(date).toDateString() +
        " " +
        new Date(date).toTimeString().split(" ")[0];
    str = str.slice(0, -3);
    return str;
}

</script>

<template>
    <NavBar />
    <div>
        <div class="row justify-content-center  p-4 ">
            <div class="col-lg-3 col-12 ">
                <div class="align-items-center">
                    <h2 class="mx-auto">Eventi prossimi</h2>
                </div>
                <div class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4"
                    style="max-height: 80vh">
                    <div v-if="nearEvents.length == 0">
                        <h1>Non ci sono eventi prossimi</h1>
                    </div>
                    <div v-else>
                        <div v-for="event in nearEvents" class="bg-success rounded-3 text-black m-2">
                            <div v-for="date in event.dates">
                                <h4>{{ event.title }}</h4>
                                {{ event.details.text }}

                                <p>{{ getVisibleDate(date.begin) }}</p>
                                <p>{{ getVisibleDate(date.end) }}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
            <div class="col-lg-3 col-12">
                <div class="align-items-center">
                    <h2 class="mx-auto">Ultima nota modificata</h2>
                </div>
                <div @click="gotoNote" class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4"
                    style="max-height: 80vh">
                    <button class="btn bg-success rounded-3 text-black m-2">
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
            <div class="col-lg-3 col-12">
                <div class="align-items-center">
                    <h2 class="mx-auto">Progetti in corso</h2>
                </div>
                <div class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4"
                    style="max-height: 80vh">
                    <div class="bg-success rounded-3 text-black m-2">
                        <div v-if="progetti.value">

                        </div>
                        <div v-else>
                            Non ci sono progetti in corso
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
</style>
