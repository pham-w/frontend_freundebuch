<template>
  <main class="page">
    <h1>Login</h1>

    <form @submit.prevent="onLogin" class="card">
      <label>
        Email
        <input v-model="email" type="email" required />
      </label>

      <label>
        Passwort
        <input v-model="password" type="password" required />
      </label>

      <button type="submit">Einloggen</button>

      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { login } from "@/services/authApi";
import { useRouter } from "vue-router";
import { setAuthUser } from "@/services/authStore";

const router = useRouter();
const email = ref("");
const password = ref("");
const error = ref<string | null>(null);

async function onLogin() {
  error.value = null;
  try {
    const user = await login(email.value, password.value);
    setAuthUser(user);
    await router.push("/"); // zurück zur Startseite
  } catch (e: any) {
    error.value = e?.message ?? "Login fehlgeschlagen";
  }
}
</script>

<style scoped>
.page { padding: 24px; max-width: 480px; margin: 0 auto; }
.card { display: grid; gap: 12px; padding: 16px; border: 1px solid #ddd; border-radius: 12px; }
label { display: grid; gap: 6px; }
input { padding: 10px; border: 1px solid #ccc; border-radius: 8px; }
button { padding: 10px; border-radius: 10px; border: 0; cursor: pointer; }
.error { color: #b00020; }
</style>
