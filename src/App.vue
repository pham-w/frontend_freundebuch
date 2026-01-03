<script setup lang="ts">
import { ref } from "vue";
import { RouterLink, RouterView } from "vue-router";
import SplashScreen from "@/components/SplashScreen.vue";

const showSplash = ref(true);

function closeSplash() {
  showSplash.value = false;
}
</script>

<template>
  <SplashScreen v-if="showSplash" @close="closeSplash" />

  <header v-else>
    <div class="wrapper">
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/about">About</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView v-if="!showSplash" />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  padding: 16px;
}

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a {
  display: inline-block;
  padding: 0 1rem;
  border-left: 1px solid var(--color-border);
}

nav a:first-of-type {
  border: 0;
}

@media (min-width: 1024px) {
  nav {
    text-align: left;
    font-size: 1rem;
    padding: 1rem 0;
  }
}
</style>
