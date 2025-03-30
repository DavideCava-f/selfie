<script setup>
import { store } from '@/store';
import { ref, onMounted, watch } from "vue";
import CreateEvent from './CreateEvent.vue';
import CreateActivity from './CreateActivity.vue';

let choice = ref(Boolean);

onMounted(()=>{
    console.log("mounted create")
    choice.value = true; 
});


</script>

<template>
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
        <div class="modal-header">
            <button class="modal-title fs-4 btn" id="staticBackdropLabel" @click="choice = true">
            Create Event
            </button>
            <button class="btn modal-title fs-4" @click="choice=false">Create Avtivity</button>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
            <div v-if="choice">
                <CreateEvent />
            </div>
            <div v-else>
                <CreateActivity />
            </div>
        </div>
        </div>
    </div>

</template>

<style scoped>

</style>