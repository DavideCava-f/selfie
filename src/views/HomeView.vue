<script setup>
import NavBar from "@/components/NavBar.vue";

const eventsOfToday = [
    {
        UserEmail: "ex@s",
        dates: [
            {
                begin: "2025-01-02T5:00:31.901Z",
                end: "2025-01-02T7:15:31.901Z"
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
                end: "2025-01-02T17:11:31.901Z"
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
                end: "2025-01-02T17:30:31.901Z"
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
                end: "2025-01-02T20:00:31.901Z"
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
                end: "2025-01-02T20:00:31.901Z"
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
    <NavBar />
    <div class="bg">
        <div class="row justify-content-center  p-4 ">
            <div class="col-lg-3 col-12 "> 
                <div class="align-items-center">
                    <h2 class="mx-auto">Eventi prossimi</h2>
                </div>
                <div class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4" style="max-height: 80vh">
                    <RouterLink v-for="event in eventsOfToday" class="bg-success rounded-3 text-black m-2">
                        <h4>{{ event.title }}</h4>
                        {{ event.details.text }}
                    </RouterLink>
                </div>
            </div>
            <div class="col-lg-3 col-12">
                <div class="align-items-center">
                    <h2 class="mx-auto">Ultima nota modificata</h2>
                </div>
                <div class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4" style="max-height: 80vh">
                    <RouterLink v-for="event in eventsOfToday" class="bg-success rounded-3 text-black m-2">
                        <h4>{{ event.title }}</h4>
                        {{ event.details.text }}
                    </RouterLink>
                </div>
            </div>
            <div class="col-lg-3 col-12">
                <div class="align-items-center">
                    <h2 class="mx-auto">Eventi prossimi</h2>
                </div>
                <div class="container-fluid bg-danger d-flex flex-column overflow-scroll rounded-4" style="max-height: 80vh">
                    <RouterLink v-for="event in eventsOfToday" class="bg-success rounded-3 text-black m-2">
                        <h4>{{ event.title }}</h4>
                        {{ event.details.text }}
                    </RouterLink>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.bg{
    background-color: rgb(252, 114, 109);
}
</style>
