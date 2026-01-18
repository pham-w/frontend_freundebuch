<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";


const router = useRouter();

// Props holen
const props = defineProps<{ person: any; visible: boolean; isFavorite?: boolean}>();
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
  (e: "toggle-favorite"): void;
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
    <h2>{{ props.person.name }}</h2>

    <ul>
      <li>Alter: {{ displayAge ?? "—" }}</li>
      <li>Geburtsdatum: {{ props.person.geburtsdatum }}</li>
      <li>Lieblingsfarbe: {{ props.person.favColor }}</li>
      <li>Hobby: {{ props.person.hobby }}</li>
      <li>Lieblingsessen: {{ props.person.favFood }}</li>
      <li>Traumberuf: {{ props.person.dreamJob }}</li>
    </ul>

    <div class="buttons">
      <button class="edit-btn" @click="editEntry(props.person.id)">
        ✏️ Eintrag bearbeiten
      </button>

      <button class="fav-star" @click.stop="emit('toggle-favorite')">
        {{ props.isFavorite ? "⭐" : "☆" }}
      </button>

      <button class="delete-btn" @click="deleteEntry">
        🗑 Eintrag löschen
      </button>
    </div>
  </div>
</template>

<style scoped>
.page {
  border: 1px solid #ddd;
  border-radius: 12px;
  padding: 20px;
  margin: 10px;
  background: #fff;
  color: #181818;
  position: relative;
}

.fav-star {
  position: absolute;
  top: 14px;
  right: 14px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 22px;
  line-height: 1;
}
.fav-star:hover {
  transform: scale(1.08);
}

.buttons {
  display: flex;
  gap: 8px;
  margin-top: 12px;
}

/* Bearbeiten-Button */
.edit-btn {
  padding: 8px 14px;
  border-radius: 12px;
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
  border-radius: 12px;
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
