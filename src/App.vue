<script setup lang="ts">
import { ref } from "vue";
import { RouterView, RouterLink } from "vue-router";
import SplashScreen from "@/components/SplashScreen.vue";
import Logo from "@/components/Logo.vue";

const showSplash = ref(true);

function closeSplash() {
  showSplash.value = false;
}
</script>

<template>
  <!-- 🟣 Splash nur am Anfang -->
  <SplashScreen v-if="showSplash" @close="closeSplash" />

  <!-- 🟡 App-Shell mit Header + Logo-Home-Button -->
  <div v-else class="app-shell">
    <header class="app-header">
      <!-- ⭐ Logo als Home-Button -->
      <RouterLink :to="{ name: 'home' }" class="logo-link">
        <Logo />
      </RouterLink>

      <!-- optional: kleine Navigation -->
      <nav class="main-nav">
        <RouterLink :to="{ name: 'home' }">Freundebuch</RouterLink>
        <RouterLink :to="{ name: 'new-entry' }">Neuer Eintrag</RouterLink>
        <RouterLink :to="{ name: 'calendar' }">Kalender</RouterLink>
      </nav>
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
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
}

.logo-link {
  display: inline-flex;
  align-items: center;
}

/* Logo etwas kleiner */
.logo-link svg {
  width: 80px;
  height: 80px;
  cursor: pointer;
}

.main-nav {
  display: flex;
  gap: 10px;
  font-size: 14px;
}

.main-nav a {
  text-decoration: none;
}

.main-nav a.router-link-active {
  font-weight: 600;
  text-decoration: underline;
}

.app-main {
  flex: 1;
}
</style>
