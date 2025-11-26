<script setup lang="ts">
import { ref, onMounted } from "vue";
import UserCard from "@/components/UserCard.vue";

const users = ref<User[]>([]);

onMounted(() => {
  const stored = localStorage.getItem("users");
  users.value = stored ? JSON.parse(stored) : [];
});
</script>

<template>
  <div class="p-5 max-w-xl mx-auto">
    <h1 class="text-3xl font-bold text-center mb-5">Users</h1>

    <UserCard
      v-for="u in users"
      :key="u.email"
      :username="u.username"
      :email="u.email"
      :isActive="u.isActive"
      :likes="u.likes"
    />
  </div>
</template>
