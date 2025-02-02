import { createRouter, createWebHistory } from 'vue-router'



import WelcomeView from '../views/WelcomeView.vue'
import LoginView from '../views/LoginView.vue'
import SignUpView from '@/views/signUpView.vue'
import HomeView from '../views/HomeView.vue'
import CalendarView from '../views/CalendarView.vue'
import NoteView from '../views/NoteView.vue'

const routes = [

  { path: '/', component: WelcomeView },
  { path: '/login', component: LoginView },
  { path: '/signup', component: SignUpView },
  { path: '/', redirect: '/calendar' },
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