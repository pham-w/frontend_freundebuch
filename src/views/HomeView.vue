<script setup lang="ts">
import FriendBook from "@/components/FriendBook.vue";
import { useRouter } from "vue-router";

const router = useRouter();

</script>

<template>
  <main class="page">
    <div class="topbar">
      <div class="right">
        <button class="logout-btn" @click="router.push('/new')">
          ➕ Neuer Eintrag
        </button>
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
