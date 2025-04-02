<script setup>
import { ref, onMounted, computed, watch } from "vue";
import { store } from '@/store';
import { getEventsOfDay } from '@/eventGetter';
import { getActivitiesOfDay } from '@/activityGetter';
import { Temporal } from "@js-temporal/polyfill";

const isEvent = ref(Boolean);
const VisualizedDate = computed(() => store.value.simDate.add({ days: store.value.dayOffset }));

function getDate(i) {
  store.value.dayOffset += i;
}

onMounted(() => {
  getEventsOfDay();
  getActivitiesOfDay();
});

watch(() => store.value.dayOffset, () => getEventsOfDay());
watch(() => store.value.dayOffset, () => getActivitiesOfDay());
</script>

<template>
  <div class="d-flex flex-column justify-content-center">
    <div class="d-flex justify-content-between flex-fill bg-light text-center mx-1 my-3 rounded-3">
      <button class="btn d-flex align-self-center" @click="getDate(-1)">
        <img src="@/assets/Indietro.svg" />
      </button>

      <div v-if="store.dayOffset === 0" class="align-self-center">
        TODAY {{ VisualizedDate.toString() }}
      </div>
      <div v-else-if="store.dayOffset === 1" class="align-self-center">
        TOMORROW {{ VisualizedDate.toString() }}
      </div>
      <div v-else class="align-self-center">
        {{ VisualizedDate.toString() }}
      </div>
      <button v-if="store.dayOffset !== 0" class="btn" @click="store.dayOffset = 0">
        R
      </button>
      <button class="btn d-flex align-self-center" @click="getDate(1)">
        <img src="@/assets/avanti.svg" />
      </button>
    </div>

    <div class="mx-1">
      <div>
        <button class="btn" @click="isEvent = true">
          Events
        </button>
        <button class="btn" @click="isEvent = false">
          Activities
        </button>
      </div>

      <div v-if="isEvent">
        <h3>Events</h3>
        <div class="overflow-scroll rounded-3" style="max-height: 70vh;">
          <div v-for="event in store.eventsOfDay" class="flex-fill bg-light m-1 p-3 rounded-3">
            <div>
              <button
                @click="store.activeEventId = event._id; store.activeDate = store.simDate.add({ days: store.dayOffset }); console.log(store.activeEventId)"
                data-bs-target="#VisualizeEventModal" data-bs-toggle="modal">Visualize</button>
              <h4>{{ event.title }}</h4>
              {{ event.details.text }}
              <footer>
                <a :href="event.details.link">LOCATION</a>
              </footer>
            </div>
          </div>
        </div>
      </div>

      <div v-else>
        <h3>Activities</h3>
        <div class="overflow-scroll rounded-3" style="max-height: 70vh;">
          <div v-for="activity in store.activitiesOfDay" class="card">
            <div class="card-body">
              <h4 class="card-title fw-bold">{{ activity.title }}</h4>
              <hr />
              {{ activity.text }}
              <hr />
              <div
                :class="{ late: Temporal.PlainDateTime.compare(store.simDateTime, activity.dates[0].deadline.slice(0, -1)) > 0 }">
                Deadline:{{ Temporal.PlainDateTime.from(activity.dates[0].deadline.slice(0, -1)).toString() }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>
.late {
  color: red;
}
</style>
