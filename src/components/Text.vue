<script setup>
// Props and Emits
const props = defineProps({
    phrase: String,
    currentWord: String
});
const emit = defineEmits([
]);
</script>

<template>
    <span class="big current">{{ currentWord }}</span>
    <template v-for="word in phrase.split(' ').slice(1)">
        <span class="big">{{ " " + word }}</span>
    </template>
    <br>
</template>


<style>
.big {
  font-size: 25px;
}
.current {
    background-color: aquamarine;
}
</style>