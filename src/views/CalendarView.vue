<script setup>
import NavBar from '@/components/NavBar.vue';
import { store } from '@/store';
// const emits = defineEmits(['click', 'next'])

// Impegni giornalieri per test
const eventsOfToday = [
    {
        UserEmail: "ex@s",
        dates: [
            {
                begin: "2025-01-02T5:00:31.901Z",
                end:  "2025-01-02T7:15:31.901Z"
            }
        ],
        title: "Andare in palestra",
        details: {
            text: "SPINGI UOMO",
            link: "https://maps.app.goo.gl/gPhTovasF9RLoMSRA"
        }
    },
    {
        UserEmail: "ex@s",
        dates: [
            {
                begin: "2025-01-02T17:10:31.901Z",
                end:  "2025-01-02T17:11:31.901Z"
            }
        ],
        title: "Spesa",
        details: {
            text: "vai al supermercato a comprare il latte per la mamma",
            link: "https://maps.app.goo.gl/kxbne8kFRQAMiWrw9"
        }
    },
    {
        UserEmail: "ex@s",
        dates: [
            {
                begin: "2025-01-02T17:20:31.901Z",
                end:  "2025-01-02T17:30:31.901Z"
            }
        ],
        title: "Rifare il letto",
        details: {
            text: "Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house, fuckin' up the way the nigger talks. Motherfucker do that shit to me, he better paralyze my ass, 'cause I'll kill the motherfucker, know what I'm sayin'?",
            link: "https://maps.app.goo.gl/wwgU8BDqYmDZ7aeK7"
        }
    },
    {
        UserEmail: "ex@s",
        dates: [
            {
                begin: "2025-01-02T18:00:31.901Z",
                end:  "2025-01-02T20:00:31.901Z"
            }
        ],
        title: "Guardare Gossip Girl",
        details: {
            text: "Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house",
            link: "https://maps.app.goo.gl/93WvkGFvd9R6LkUKA"
        }
    },
    {
        UserEmail: "ex@s",
        dates: [
            {
                begin: "2025-01-02T18:00:31.901Z",
                end:  "2025-01-02T20:00:31.901Z"
            }
        ],
        title: "Guardare Gossip Girl",
        details: {
            text: "Look, just because I don't be givin' no man a foot massage don't make it right for Marsellus to throw Antwone into a glass motherfuckin' house",
            link: "https://maps.app.goo.gl/93WvkGFvd9R6LkUKA"
        }
    }
]

</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
    <div class="container-fluid">
        <div class="row bg-dark d-flex justify-content-center flex-column">
            <div class="text-white">{{ store.formattedRealTime }}</div>
            <div class="text-white">{{ store.formattedSimTime }}</div>
        </div>
        <div class="row bg-dark p-3" style="">
            <div class="col-lg-4 col-12 mt-3 bg-warning rounded-4"> <!-- colonna day-->
                <div class="d-flex flex-column justify-content-center">
                    <div class="d-flex justify-content-between flex-fill bg-light text-center mx-1 my-3 rounded-3">
                        <button class="btn d-flex align-self-center"><img src="@/assets/Indietro.svg"></button>
                        <div class="align-self-center">TODAY</div>
                        <button class="btn d-flex align-self-center"><img src="@/assets/avanti.svg"></button>
                    </div>

                    <div class="overflow-scroll rounded-3" style="max-height: 50vh;">
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
            <div class="col-lg-8 col-12 mt-3 bg-primary rounded-4">
                <table class="table">
                    
                </table>
            </div>
        </div>
    </div>
</template>

<style scoped>
</style>
