<script setup lang="ts">
import { ref, computed } from "vue";
import { RouterView, RouterLink, useRouter, useRoute } from "vue-router";
import SplashScreen from "@/components/SplashScreen.vue";
import Logo from "@/components/Logo.vue";
import { authUser, logout } from "@/services/authStore";

const router = useRouter();
const route = useRoute(); // ✅ DAS FEHLT

const showSplash = ref(true);

function closeSplash() {
  showSplash.value = false;
}

function handleLogout() {
  logout();
  router.push({ name: "login" });
}

const username = computed(() => authUser.value?.name ?? "");

const showLogout = computed(() => {
  const loggedIn = !!authUser.value; // oder !!authUser.value?.token
  const isAuthPage = route.name === "login" || route.name === "register";
  return loggedIn && !isAuthPage;
});
</script>

<template>
  <!-- Splash Screen -->
  <SplashScreen v-if="showSplash" @close="closeSplash" />

  <!-- Header + Home-Button -->
  <div v-else class="app-shell">
    <header class="app-header">

      <!-- Logo+Begrüßung -->
      <div class="left">
        <RouterLink :to="{ name: 'home' }" class="logo-link">
          <Logo />
        </RouterLink>
        <span v-if="authUser" class="greeting">
          ⋆˚꩜｡Hallo, {{ username }} ⋆˚꩜｡
        </span>
      </div>

      <!-- Logout  -->
      <div class="right">
        <button v-if="showLogout" class="logout-btn" @click="handleLogout">Logout</button>
      </div>


    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}


.app-header {
  width: 100%;
  padding: 30px 50px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
}

.left {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 50px;
}

.logo-link,
.logo-link svg{
  width: 80px;
  height: 80px;
  cursor: pointer;
  background: transparent;
}

.right {
  display: flex;
  justify-content: flex-end;
}

.greeting {
  font-size: 25px;
  font-weight: 600;
  color: white;
}

.logout-btn {
  padding: 8px 16px;
  font-size: 15px;
  border-radius: 12px;
  border: none;
  background-color: #732a53;
  color: #e9e5de;
  cursor: pointer;
}

.logout-btn:hover {
  background-color: #461d3a;
}

.app-main {
  width: 100%;
  margin-left: 10px;
  margin-right: auto;
  padding-left: 20px;
}
</style>
