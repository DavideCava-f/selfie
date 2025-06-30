<script setup>
import { store } from '@/store';
import { ref, onMounted, watch } from "vue";
import CreateEvent from './CreateEvent.vue';
import CreateActivity from './CreateActivity.vue';

let choice = ref(Boolean);
let closed = ref(false);

const props = defineProps({
    date: String,
});

onMounted(() => {
    console.log("mounted create")
    choice.value = true;
    closed.value = false;
});

watch(() => props.date,()=> {console.log(props.date)})

</script>

<template>
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content custom-modal">
            <div class="modal-header bg-header">
                <button class="modal-title fs-4 btn" id="staticBackdropLabel" @click="choice = true">
                    Create Event
                </button>
                <button class="btn modal-title fs-4" @click="choice = false">Create Activity</button>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="store.toggle=!store.toggle"></button>
            </div>
            <div class="">
                <div v-if="choice">
                    <CreateEvent :date="props.date" />
                </div>
                <div v-else>
                    <CreateActivity @created="store.update()" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

.custom-modal {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(200, 50, 100, 0.1);
  border: 1px solid #ff0051;
  background-color: #ffd0da;
}
.bg-header {
  background-color: #f383a5;
}


</style>
