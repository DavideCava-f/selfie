<script setup>
import { computed } from 'vue';

const props = defineProps({
  date: {
    type: [String, Date],
    default: ''
  },
  min: {
    type: [String, Date],
    default: null
  },
  max: {
    type: [String, Date],
    default: null
  }
});

const emit = defineEmits(["update:date"]);

const internalDate = computed({
  get() {
    return props.date;
  },
  set(value) {
    emit("update:date", value)
  }
})
</script>

<template>
  <b-form-datepicker v-model="internalDate" class="w-100" :min="min" :max="max" locale="it" value-as-date
    placeholder="Seleziona data" />
</template>

<style scoped></style>
