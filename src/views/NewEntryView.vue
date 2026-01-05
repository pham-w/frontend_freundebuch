<script setup lang="ts">
import AddFriendForm from "@/components/Eintrag.vue";
import { useRouter } from "vue-router";

const router = useRouter();

function onCreated() {
  // nach dem Speichern zurück zur Home-Seite
  router.push("/");
}
</script>

<template>
  <main style="padding: 20px;">
    <h1>Neuen Freund anlegen</h1>

    <AddFriendForm @created="onCreated" />
  </main>
</template>
