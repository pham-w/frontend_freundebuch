<script setup lang="ts">
import { ref } from "vue";
import { RouterView } from "vue-router";
import SplashScreen from "@/components/SplashScreen.vue";

const showSplash = ref(true);

function closeSplash() {
  showSplash.value = false;
}
</script>

<template>
  <SplashScreen v-if="showSplash" @close="closeSplash" />
  <RouterView v-else />
</template>

<style scoped>
</style>
