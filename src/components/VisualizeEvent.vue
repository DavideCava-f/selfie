<script setup>

const props = defineProps(['activeEventId'])

var event = ref('')

function getEvent(){


  fetch(`${store.value.url}:${store.value.port}/event/OneEvent?id=${activeEventId}`, {

   method:"get"
  }
  ).then(response =>{event.value = response});

}

</script>


<template>

  <div class="modal-dialog modal-dialog-centered modal-lg">
    <div class="modal-content">
      <div class="modal-header">
        <h1 class="modal-title fs-4" id="staticBackdropLabel">
          Create new event
        </h1>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"
          @click="getEvent">getEvent</button>
      </div>
      <div class="modal-body">
        <div class="my-2">
          <label for="title">Title</label>
          <input class="form-control" type="text" placeholder="Enter event title" v-model="eventTitle" name="value" />
        </div>

        <div class="my-2">
          <label>Details</label>
          <textarea class="form-control" rows="4" placeholder="Start typing the details..."
            v-model="eventText"></textarea>
        </div>

        <br />

        <div class="my-2">
          <label>Start</label>
          <div class="d-flex flex-sm-nowrap flex-wrap gap-2">
            <input class="form-control" type="date" v-model="eventBeginDate" />
            <input class="form-control" type="time" v-model="eventBeginTime" />
            <button class="btn btn-outline-primary" @click="setBeginNow">
              Now
            </button>
            <button class="btn btn-outline-danger" @click="resetBegin">
              Reset
            </button>
          </div>
        </div>
        <div class="my-2">
          <label>End</label>
          <div class="d-flex flex-sm-nowrap flex-wrap gap-2">
            <input class="form-control" type="date" :min="eventBeginDate" v-model="eventEndDate" />
            <input class="form-control" type="time" v-model="eventEndTime" />
            <button class="btn btn-outline-primary" @click="setEndNow">
              Now
            </button>
            <button class="btn btn-outline-danger" @click="resetEnd">
              Reset
            </button>
          </div>
        </div>
        <div class="my-2">
          <button class="btn btn-outline-success" type="button" id="tuttoIlGiorno" @click="allDay">
            All day
          </button>
        </div>
        <div class="form-check my-2">
          <input class="form-check-input" type="checkbox" id="repeatable" :disabled="eventBeginDate.toString() !== eventEndDate.toString() ||
            !eventBeginDate
            " v-model="repeatable" />
          <label class="form-check-label" for="repeatable">Repeatable</label>
        </div>
        <div v-if="repeatable" class="row my-2">
          <div class="col-sm-6 col-12">
            <label>Frequence</label>
            <div>
              <select class="form-select" v-model="frequenceSelected.type">
                <option value="d">Every day</option>
                <option value="w">One/more days a week</option>
                <option value="m">Every month this day</option>
              </select>
            </div>
            <br />
            <div v-if="frequenceSelected.type === 'w'"
              class="d-flex flex-wrap gap-1 justify-content-between gap-1 mx-2">
              <div v-for="day in store.week" :key="day">
                <input type="checkbox" class="btn-check" autocomplete="off"
                  v-model="frequenceSelected.option[store.week.indexOf(day)]"
                  :checked="store.week.indexOf(day) === dayOfWeek" :disabled="store.week.indexOf(day) === dayOfWeek"
                  :id="day" />
                <label class="btn btn-outline-primary rounded-pill" :for="day">{{ day.slice(0, 2) }}
                </label>
              </div>
            </div>
          </div>
          <div class="col-sm-6 col-12 my-sm-0 my-3">
            <label>Repetition</label>
            <div>
              <select class="form-select" v-model="repetitionSelected.type" @change="repetitionSelected.option = ''">
                <option value="i">Repeat indefinitely</option>
                <option value="n">Repeat n times</option>
                <option value="u">Repeat until</option>
              </select>
            </div>
            <br />
            <div class="d-flex align-items-center gap-1" v-if="repetitionSelected.type === 'n'">
              <input class="form-control" type="number" min="1" max="3650" placeholder="Insert n"
                v-model="repetitionSelected.option" />
              <div class="form-text text-nowrap">Min. 1, Max. 3650</div>
            </div>
            <div v-else-if="repetitionSelected.type === 'u'">
              <input class="form-control" type="date" :min="store.simDate" v-model="repetitionSelected.option" />
            </div>
          </div>
        </div>
        <br />
        <div class="my-2">
          <label>Link</label>
          <input class="form-control" type="text" placeholder="Luogo fisico o virtuale" v-model="eventLink" />
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-end">
        <button class="btn btn-secondary" :disabled="!eventText" @click="generateDetails">
          AI
        </button>
        <button type="button" class="btn btn-primary" data-bs-dismiss="modal" :disabled="!canCreateEvent()"
          @click="createEvent">
          Create
        </button>
      </div>
    </div>
  </div>



</template>

<style scoped>


</style>