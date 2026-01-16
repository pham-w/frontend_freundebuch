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

.app-main {
  flex: 1;
}
</style>
