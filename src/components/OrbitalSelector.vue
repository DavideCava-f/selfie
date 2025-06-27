<script setup>
import { ref, computed, onUnmounted, watch } from 'vue';
const props = defineProps(['items', 'radius', 'color', 'selected'])
const emit = defineEmits(['update:selected'])

const angle = 360 / (props.items?.length || 1);
</script>

<template>
  <g v-for="(item, i) in props.items" :key="item" :transform="`rotate(${angle * i}) translate(0, -${props.radius})`"
    class="selector" @click="emit('update:selected', item)">
    <rect class="rect" :x="-item.toString().length * 3 - (selected === item ? 14 : 10)"
      :y="-(selected === item ? 14 : 10)" :width="item.toString().length * 6 + (selected === item ? 28 : 20)"
      :height="selected === item ? 28 : 20" rx="8" :fill="selected === item ? '#3b82f6' : color" />
    <text y="5" text-anchor="middle" fill="#111" font-size="13" style="user-select: none; pointer-events: none;">
      {{ item }}
    </text>
  </g>
</template>


<style scoped>
.selector {
  cursor: pointer;
}

.rect {
  transition: transform 0.2s ease, fill 0.2s ease;
}

.selector:hover .rect {
  transform: scale(1.2);
}

svg {
  user-select: none;
}
</style>
