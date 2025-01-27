<script setup>
import { ref, computed } from 'vue'
import Text from './components/Text.vue'
import TypeInput from './components/TypeInput.vue'
import { useWordGenerator } from './composables/WordGenerator';
import Leaderboard from './components/Leaderboard.vue';

// Variables
const currentMaxWords = ref(10);
const phrase = ref("");
const currentWord = computed(() => phrase.value.split(" ")[0]);
const maxTime = ref(10);
const lastScore = ref(null);
const username = ref("");


// Functions
async function changeWord() {
  phrase.value = phrase.value.split(" ").slice(1).join(" ");
  const nextWord = await useWordGenerator();
  next(nextWord);
}

async function end(numWords) {
  lastScore.value = numWords.value / (maxTime.value / 60);
  if (username.value) {
    await fetch('https://site232465.tw.cs.unibo.it/insertScore',
      {
        method: 'POST',
        headers: {'Accept': 'application/json',
                  'Content-Type': 'application/json'},
        body: JSON.stringify({"name": username.value,
                              "score": lastScore.value})
      }
    );
  }
}

function next(word) {
  phrase.value += word + " ";
}

async function main() {
  for (let i=0; i<currentMaxWords.value; i++) {
    const nextWord = await useWordGenerator();
    next(nextWord);
  }
}


// Init
main();
</script>

<template class="all">
  <input v-model="username" placeholder="Insert your username">
  <input type="number" min="1" v-model="maxTime" placeholder="Set max time in seconds">
  <br>
  <Text
    v-if="phrase"
    :phrase="phrase"
    :currentWord="currentWord"
  />
  <p v-else>Loading words...</p>
  
  <TypeInput
    :maxTime="maxTime"
    :word="currentWord"
    @changeWord="changeWord"
    @end="end"
  />

  <h4 v-if="lastScore !== null">
    Your last score was: {{ lastScore }}
  </h4>

  <Leaderboard />
</template>

<style scoped>
.all {
  align-items: center;
}
</style>