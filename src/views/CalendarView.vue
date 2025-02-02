<script setup>
import NavBar from '@/components/NavBar.vue';
import { store } from '@/store';
// const emits = defineEmits(['click', 'next'])

</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
    {{ store.formattedRealTime }}
    <br>
    {{ store.formattedFakeTime }}
</template>

<style scoped>
</style>