import { createRouter, createWebHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import NewEntryView from "@/views/NewEntryView.vue";
import EditEntryView from "@/views/EditEntryView.vue";
import LoginView from "@/views/LoginView.vue";
import RegisterView from "@/views/RegisterView.vue";
import { isLoggedIn } from "@/services/authStore";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    // Auth-Seiten
    { path: "/login", name: "login", component: LoginView },
    { path: "/register", name: "register", component: RegisterView },

    // App-Seiten
    { path: "/", name: "home", component: HomeView, meta: { requiresAuth: true } },
    { path: "/new", name: "new-entry", component: NewEntryView, meta: { requiresAuth: true } },
    { path: "/edit/:id", name: "edit-entry", component: EditEntryView, meta: { requiresAuth: true } },

    // Fallback
    { path: "/:pathMatch(.*)*", redirect: "/" },
  ],
});


router.beforeEach((to) => {
  if (to.meta.requiresAuth && !isLoggedIn()) {
    return { name: "login" };
  }


  if ((to.name === "login" || to.name === "register") && isLoggedIn()) {
    return { name: "home" };
  }
});

export default router;
