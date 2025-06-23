<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
import { store } from "@/store";
import "vue3-toastify/dist/index.css";
import { toast } from "vue3-toastify";

var Day = ref(store.value.simDate.day)
var DayArray = ref(getArrayToN(30,store.value.simDate.day,0))//Giorni nel mese avanti ad ora
var YearArray = ref(getArrayToN(10,0,store.value.simDate.year))
var Month = ref(store.value.simDate.month)
var Year = ref(store.value.simDate.year)

function getArrayToN(N,min,offset){
    const array = [];
for (let i = min; i <= N; i++) {
  array.push(i+offset);
}

return array
}

</script>

<template>

<span>
        <select v-model="Day">
            <option v-for="n in DayArray" :key="n" :value="n">{{ n }}</option>
        </select>
    /
        <select v-model="Month">
            <option v-for="n in 12" :key="n" :value="n">{{ n }}</option>
        </select>
    /
        <select v-model="Year">
            <option v-for="n in YearArray" :key="n" :value="n">{{ n }}</option>
        </select>

</span>



</template>