<script setup>
import useStore from '@/composables/store';
import NavBar from '@/components/NavBar.vue';
import { defineProps, defineEmits } from 'vue';

const store = useStore();
// const emits = defineEmits(['click', 'next'])

</script>

<template>
    <!-- <button @click="emits('click')"></button> -->
    <NavBar />
</template>

<style scoped>
</style>