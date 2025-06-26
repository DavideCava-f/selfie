<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
const props = defineProps(['items', 'radius', 'selected'])
const emit = defineEmits(['update:selected'])

const angle = 360 / (props.items?.length || 1);
</script>

<template>
  <g>
    <g v-for="(item, i) in props.items" :key="item" :transform="`rotate(${angle * i}) translate(0, -${props.radius})`"
      class="selector" @click="emit('update:selected', item)">
      <circle :r="selected === item ? 18 : 14" :fill="selected === item ? '#3b82f6' : '#d1d5db'" />
      <text y="5" text-anchor="middle" fill="#111" font-size="13" style="user-select: none; pointer-events: none;">
        {{ item }}
      </text>
    </g>
  </g>
  <!-- <g> -->
  <!--   <g v-for="(item, i) in items" :key="item" :transform="`rotate(${angle * i}) translate(0, -${radius})`" -->
  <!--     class="transition-all duration-300 cursor-pointer" @click="$emit('update:selected', item)"> -->
  <!--     <circle :r="selected === item ? 16 : 10" :fill="selected === item ? '#00f' : '#999'" /> -->
  <!--     <text y="4" text-anchor="middle" fill="black" font-size="12">{{ item }}</text> -->
  <!--   </g> -->
  <!-- </g> -->
</template>


<style scoped>
.selector {
  cursor: pointer;
  transition: transform 0.25s ease;
}

.selector:hover {
  transform: scale(1.2);
}

svg {
  user-select: none;
}
</style>
