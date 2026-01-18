<script setup lang="ts">
import FriendBook from "@/components/FriendBook.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const showOnlyFavs = ref(false);


</script>

<template>
  <main class="page">
    <div class="topbar">
      <div class="right">
        <button class="logout-btn" @click="router.push('/new')">
          ➕ Neuer Eintrag
        </button>
        <button class="fav-btn" @click="showOnlyFavs = !showOnlyFavs">
          {{ showOnlyFavs ? "⭐ Favoriten (an)" : "☆ Favoriten" }}
        </button>
      </div>
    </div>
    <FriendBook :showOnlyFavs="showOnlyFavs" />
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
  justify-content: flex-start;
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
.fav-btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 0;
  background: #111827;
  color: white;
  font-weight: 600;
  cursor: pointer;
}
.fav-btn:hover {
  opacity: 0.92;
}

</style>
