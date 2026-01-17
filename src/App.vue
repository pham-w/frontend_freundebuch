<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRouter } from "vue-router";
import SplashScreen from "@/components/SplashScreen.vue";
import Logo from "@/components/Logo.vue";
import { authUser, logout } from "@/services/authStore";

const router = useRouter();
const showSplash = ref(true);

function closeSplash() {
  showSplash.value = false;
}

function handleLogout() {
  logout();
  router.push({ name: "login" });
}

const username = computed(() => authUser.value?.name ?? "");
</script>

<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @close="closeSplash" />

  <!-- Header + Home-Button -->
  <div v-else class="app-shell">
    <header class="app-header">
      <!-- Logo als Home-Button -->
      <RouterLink :to="{ name: 'home' }" class="logo-link">
        <Logo />
      </RouterLink>

      <!-- Begrüßung + Logout  -->
      <div class="header-right" v-if="authUser">
        <span class="greeting">Hallo, {{ username }}!</span>
        <button class="logout-btn" @click="handleLogout">Logout</button>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  padding: 10px 16px;
  display: flex;
  justify-content: space-around;
  align-items: normal;
}

.logo-link {
  display: inline-flex;
  align-items: center;
  background: transparent;
}

.logo-link svg {
  width: 80px;
  height: 80px;
  cursor: pointer;
  background: transparent;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.greeting {
  font-size: 16px;
  font-weight: 500;
  color: white;
}

.logout-btn {
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 12px;
  border: none;
  background-color: #e11d48; /* z.B. Tailwind: rose-600 */
  color: white;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #be123c; /* dunkler beim Hover */
}

.app-main {
  flex: 1;
}
</style>
