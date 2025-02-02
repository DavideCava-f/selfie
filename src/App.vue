<script setup>
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// Per debugging, l'app porta subito a CalendarView
//router.push('/calendar');

</script>

<template>
    <RouterView />
</template>

<style scoped>
</style>