<template>
  <main class="page">
    <h1>Registrieren</h1>

    <form @submit.prevent="onRegister" class="card">
      <label>
        Name
        <input v-model="name" required />
      </label>

      <label>
        Email
        <input v-model="email" type="email" required />
      </label>

      <label>
        Passwort
        <input v-model="password" type="password" required minlength="6" />
      </label>

      <button type="submit">Account erstellen</button>

      <p v-if="msg" class="ok">{{ msg }}</p>
      <p v-if="error" class="error">{{ error }}</p>
    </form>
  </main>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { register, login } from "@/services/authApi";
import { setAuthUser } from "@/services/authStore";
import { useRouter } from "vue-router";

const router = useRouter();
const name = ref("");
const email = ref("");
const password = ref("");
const msg = ref<string | null>(null);
const error = ref<string | null>(null);

async function onRegister() {
  msg.value = null;
  error.value = null;

  try {
    // 1) registrieren
    await register(email.value, password.value, name.value);

    // 2) direkt einloggen
    const user = await login(email.value, password.value);
    setAuthUser(user);

    // 3) weiterleiten
    await router.push("/");
  } catch (e: any) {
    error.value = e?.message ?? "Registrierung fehlgeschlagen";
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
.ok { color: #1b5e20; }
</style>
