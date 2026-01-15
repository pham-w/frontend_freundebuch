<script setup lang="ts">
import FriendBook from "@/components/FriendBook.vue";
import { useRouter } from "vue-router";
import { authUser, logout } from "@/services/authStore";

const router = useRouter();

function onLogout() {
  logout();
  router.push("/login");
}
</script>


<template>
  <main class="page">
    <div class="topbar">
      <h1 class="title">Mein Freundebuch</h1>

      <div class="right" v-if="authUser">
        <span>{{ authUser.name }}</span>

        <button class="logout-btn" @click="router.push('/new')">
          ➕ Neu
        </button>

        <button class="logout-btn" @click="onLogout">Logout</button>
      </div>

    </div>

    <FriendBook />
  </main>
</template>


<style scoped>
.page {
  padding: 20px;
  display: grid;
  gap: 16px;
}

.topbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-size: 22px;
}
.logout-btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 0;
  background: #111827;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.logout-btn:hover {
  opacity: 0.92;
}
.right {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
