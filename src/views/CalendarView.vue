<script setup>
import NavBar from '@/components/NavBar.vue';
import { store } from '@/composables/store';
// const emits = defineEmits(['click', 'next'])

</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
    {{ store.formattedFakeTime }}
    <br>
    {{ store.formattedRealTime }}
</template>

<style scoped>
</style>