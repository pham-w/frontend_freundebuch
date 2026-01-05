<script setup lang="ts">
import FriendBook from '@/components/FriendBook.vue'
import { useRouter } from "vue-router";

const router = useRouter();

function goToNewEntry() {
  router.push("/new");
}

</script>

<template>
  <main class="page">
    <div class="topbar">
      <h1 class="title">Mein Freundebuch</h1>

      <button class="create-btn" @click="goToNewEntry">
        ➕ Neuen Eintrag erstellen
      </button>
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

.create-btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 0;
  background: #111827;
  color: white;
  font-weight: 600;
  cursor: pointer;
}

.create-btn:hover {
  opacity: 0.92;
}
</style>
