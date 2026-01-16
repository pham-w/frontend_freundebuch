<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();

// Props holen
const props = defineProps<{ person: any; visible: boolean }>();
function calcAge(birthDate: string | null | undefined): number | null {
  if (!birthDate) return null;

  const birth = new Date(birthDate);
  const today = new Date();

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;

  return age;
}

const displayAge = computed(() => {
  // falls Backend doch age liefert -> nutzen
  if (props.person?.age != null) return props.person.age;
  // sonst aus Geburtsdatum berechnen
  return calcAge(props.person?.geburtsdatum);
});

// Events nach oben (an FriendBook) schicken
const emit = defineEmits<{
  (e: "deleted", id: number): void;
}>();

function editEntry(id: number) {
  router.push(`/edit/${id}`);
}

function deleteEntry() {
  emit("deleted", props.person.id);
}
</script>

<template>
  <div v-show="visible" class="page">
    <h2>{{ person.name }}</h2>

    <ul>
      <li>Alter: {{ displayAge ?? "—" }}</li>
      <li>Geburtsdatum: {{ person.geburtsdatum }}</li>
      <li>Lieblingsfarbe: {{ person.favColor }}</li>
      <li>Hobby: {{ person.hobby }}</li>
      <li>Lieblingsessen: {{ person.favFood }}</li>
      <li>Traumberuf: {{ person.dreamJob }}</li>
    </ul>

    <div class="buttons">
      <!-- ✏️ Bearbeiten -->
      <button class="edit-btn" @click="editEntry(person.id)">
        ✏️ Eintrag bearbeiten
      </button>

      <!-- 🗑 Löschen -->
      <button class="delete-btn" @click="deleteEntry">
        🗑 Eintrag löschen
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  border: 1px solid #ddd;
  padding: 20px;
  margin: 10px;
  background: #fff;
  color: #181818;
  position: relative;
}

.buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

/* Bearbeiten-Button */
.edit-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid rgba(0,0,0,0.25);
  background: white;
  cursor: pointer;
  font-size: 13px;
}

.edit-btn:hover {
  background: #111827;
  color: white;
}

/* Löschen-Button */
.delete-btn {
  padding: 8px 14px;
  border-radius: 999px;
  border: 1px solid #b91c1c;
  background: #fee2e2;
  color: #b91c1c;
  cursor: pointer;
  font-size: 13px;
}

.delete-btn:hover {
  background: #b91c1c;
  color: white;
}
</style>
