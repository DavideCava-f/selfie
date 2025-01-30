import { createRouter, createWebHistory } from 'vue-router'

import AccessView from '../views/AccessView.vue'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import NoteView from '../views/NoteView.vue'

const routes = [
  { path: '/', component: AccessView },
  { path: '/home', component: HomeView },
  { path: '/calendar', component: CalendarView },
  { path: '/notes', component: NoteView },
  { path: '/projects', component: NoteView },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router;