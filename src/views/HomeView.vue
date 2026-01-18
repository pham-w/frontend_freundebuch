<script setup lang="ts">
import FriendBook from "@/components/FriendBook.vue";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();
const showOnlyFavs = ref(false);
const search = ref("");
const showFilters = ref(false);


</script>

<template>
  <main class="page">
    <div class="topbar">
      <div class="left">
        <button class="btn" @click="router.push('/new')">➕ Neuer Eintrag</button>

        <button class="btn" @click="showOnlyFavs = !showOnlyFavs">
          {{ showOnlyFavs ? "⭐ Favoriten (an)" : "☆ Favoriten" }}
        </button>

        <button class="btn" @click="showFilters = !showFilters">
          {{ showFilters ? "Filter ausblenden" : "Filter anzeigen" }}
        </button>
      </div>

      <div class="right">
        <input v-model="search" class="search" placeholder="Nach Freund suchen…" />
      </div>
    </div>

    <FriendBook
      :showOnlyFavs="showOnlyFavs"
      v-model:search="search"
      v-model:showFilters="showFilters"
    />
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
  gap: 16px;
  flex-wrap: wrap;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  padding: 10px 14px;
  border-radius: 12px;
  border: 0;
  background: #852736;
  color: white;
  font-weight: 600;
  cursor: pointer;
  line-height: 1;
}

.btn:hover {
  opacity: 0.92;
}

.btn {
  height: 40px;
  display: inline-flex;
  align-items: center;
}

.right .search {
  height: 40px;
  width: 280px;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.25);
  padding: 0 12px;
  background: rgba(255,255,255,0.92);
}


</style>
