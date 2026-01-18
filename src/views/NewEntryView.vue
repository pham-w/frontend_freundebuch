<script setup lang="ts">
import AddFriendForm from "@/components/Eintrag.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function onCreated() {
  router.push("/");
}
</script>

<template>
  <main class="page">
    <section class="card">
      <h1 >Neuen Freund anlegen</h1>
      <AddFriendForm @created="onCreated" />
    </section>
  </main>
</template>

<style scoped>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding-top: 0;
  /*background-color: ;*/
}

.card {
  width: 100%;
  max-width: 520px;
}

.card h1 {
  font-weight: 500;
  margin: 0 ;
}

</style>
