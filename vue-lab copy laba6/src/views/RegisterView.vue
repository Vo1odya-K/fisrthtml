<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const username = ref("");
const password = ref("");
const email = ref("");

function register() {
  if (!username.value || !password.value || !email.value) {
    alert("Заповніть всі поля!");
    return;
  }

  const newUser = {
    username: username.value,
    email: email.value,
    isActive: true,
    likes: 0
  };

  const users = JSON.parse(localStorage.getItem("users") || "[]");
  users.push(newUser);
  localStorage.setItem("users", JSON.stringify(users));

  router.push("/users");
}
</script>

<template>
  <div class="bg-red-400 flex items-center justify-center min-h-screen">
    <div class="w-[90%] max-w-sm p-5 flex flex-col text-center">

      <h1 class="text-4xl font-bold text-white mb-6">FATED</h1>

      <input v-model="username" type="text" placeholder="User name"
        class="p-3 mb-3 rounded text-center" />

      <input v-model="password" type="password" placeholder="Password"
        class="p-3 mb-3 rounded text-center" />

      <input v-model="email" type="email" placeholder="Email"
        class="p-3 mb-3 rounded text-center" />

      <button @click="register"
        class="p-4 bg-white text-red-500 font-bold uppercase rounded mt-4">
        REGISTER
      </button>

    </div>
  </div>
</template>
