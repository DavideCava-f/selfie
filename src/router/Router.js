import { createRouter, createWebHistory } from "vue-router";
import { store } from "@/store";

import PublicLayout from '@/layouts/PublicLayout.vue'
import PrivateLayout from '@/layouts/PrivateLayout.vue'

import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import CalendarView from "../views/CalendarView.vue";
import NoteView from "../views/NoteView.vue";
import ActivitiesView from "../views/ActivitiesView.vue";

const routes = [
  {
    path: '/',
    component: PublicLayout,
    children: [
      {
        path: '',
        redirect: 'login'
      },
      {
        path: 'login',
        name: 'Login',
        component: LoginView,
        meta: { isLoginRoute: true }
      }
    ]
  },

  {
    path: '/',
    component: PrivateLayout,
    meta: { requiresAuth: true },
    children: [
      { path: 'home', name: 'Home', component: HomeView },
      { path: 'calendar', name: 'Calendar', component: CalendarView },
      { path: 'notes', name: 'Notes', component: NoteView },
      { path: 'activities', name: 'Activities', component: ActivitiesView }
    ]
  },

  {
    path: '/:catchAll(.*)',
    redirect: '/login'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const isAuth = await store.value.checkAuth();

  if (to.meta.requiresAuth && !isAuth) {
    return next({ name: 'Login' });
  }

  if (to.meta.isLoginRoute && isAuth) {
    return next({ name: 'Home' });
  }

  next()
})

export default router;
