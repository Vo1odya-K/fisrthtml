<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
<header class="w-full">
  <nav class="w-full p-4 bg-gray-100 rounded-b-lg shadow-md max-w-full mx-auto flex gap-4">
    <RouterLink to="/" class="text-gray-700 hover:text-red-500 font-semibold">Home</RouterLink>
    <RouterLink to="/register" class="text-gray-700 hover:text-red-500 font-semibold">Register</RouterLink>
    <RouterLink to="/users" class="text-gray-700 hover:text-red-500 font-semibold">Users</RouterLink>
  </nav>
</header>

<main class="w-full px-6 mt-5">
  <RouterView />
</main>


</template>

