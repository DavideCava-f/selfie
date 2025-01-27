<script setup>
import { ref } from 'vue';

// Variables
const leaderboard = ref(null);


// Functions
async function refresh() {
    await fetch('https://site232465.tw.cs.unibo.it/leaderboard')
        .then(response => response.json())
        .then(json => leaderboard.value = json);
}

setInterval(refresh, 5000);

</script>

<template>
    <h2>Leaderboard (first 10):</h2>
    <button @click="refresh">Refresh</button>
    <ol>
        <li v-for="score in leaderboard" :key="score.score">
            {{ score.name }} | {{ score.score }}
        </li>
    </ol>
</template>

<style>
</style>