import { createRouter, createWebHistory } from "vue-router";
import { store } from "@/store";

import WelcomeView from "../views/WelcomeView.vue";
import LoginView from "../views/LoginView.vue";
import HomeView from "../views/HomeView.vue";
import CalendarView from "../views/CalendarView.vue";
import NoteView from "../views/NoteView.vue";

const routes = [
  { path: "/", component: WelcomeView },
  { path: "/login", component: LoginView, meta: { login: true } },
  { path: "/home", component: HomeView, meta: { requiresAuth: true } },
  { path: "/calendar", component: CalendarView, meta: { requiresAuth: true } },
  { path: "/notes", component: NoteView, meta: { requiresAuth: true } },
  { path: "/projects", component: NoteView, meta: { requiresAuth: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const authenticated = await store.value.checkAuth();
    if (!authenticated)
      return next("/login");
    next();
  } else if (to.meta.login) {
    const authenticated = await store.value.checkAuth();
    if (authenticated)
      return next("/home");
    next();
  }
});

export default router;
