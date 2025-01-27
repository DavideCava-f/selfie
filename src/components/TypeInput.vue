<script setup>
import { ref, computed, watch } from 'vue';
import { useTimer } from '../composables/Timer.js';

// Props and Emits
const props = defineProps({
    maxTime: Number,
    word: String
});
const emit = defineEmits([
    'changeWord',
    'end'
]);


// Variables
const started = ref(false);
const time = ref(props.maxTime);
let timer = null;

const writtenWord = ref("");
const trimmedWrittenWord = computed(() => writtenWord.value.trim());
const numWords = ref(0);

const input = ref(null);

// Functions
function checkSpace() {
    if (writtenWord.value.indexOf(" ") > -1) {
        emit('changeWord', trimmedWrittenWord);
        numWords.value += (trimmedWrittenWord.value === props.word);
        writtenWord.value = "";
    }
}

async function start() {
    started.value = true;
    timer = await useTimer(time, () => {
        emit('end', numWords);
        input.value.blur();
        reset();
    });
}

function reset() {
    started.value = false;
    time.value = props.maxTime;
    writtenWord.value = "";
    numWords.value = 0;
    clearInterval(timer);
}

watch(() => props.maxTime, (newMaxTime) => time.value = newMaxTime);

</script>

<template>
    <input ref="input" v-model="writtenWord" @input="!started ? start() : null" @keyup="checkSpace">
    <span><button :disabled="!started" @click="reset">Reset</button></span>
    <h4>Time: {{ time }}</h4>
    <p v-if="numWords">Counter: {{ numWords }}</p>
</template>

<script>
</script>