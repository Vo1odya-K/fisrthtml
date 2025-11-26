<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  username: string,
  email: string,
  isActive: boolean
}>()

const liked = ref(false)

const toggleLike = () => {
  liked.value = !liked.value
}
</script>

<template>
  <div 
    class="border p-4 mt-3 rounded-lg shadow-sm transition flex justify-between items-center"
    :class="isActive 
      ? 'border-green-500 bg-green-50 dark:bg-green-900 dark:border-green-700' 
      : 'border-gray-300 bg-white dark:bg-gray-800 dark:border-gray-600'"
  >
    
    <div>
      <h3 class="font-semibold text-lg dark:text-white">{{ username }}</h3>
      <p class="text-sm text-gray-600 dark:text-gray-300">{{ email }}</p>
      <p class="text-sm" :class="isActive ? 'text-green-700 dark:text-green-300' : 'text-gray-500 dark:text-gray-400'">
        ● {{ isActive ? 'Онлайн' : 'Офлайн' }}
      </p>
    </div>

    <div class="text-center">
      <button 
        @click="toggleLike"
        :class="liked 
          ? 'bg-red-500 text-white' 
          : 'bg-gray-300 text-gray-800 dark:bg-gray-600 dark:text-gray-200'"
        class="px-4 py-2 rounded transition hover:opacity-80"
      >
        {{ liked ? 'Liked' : 'Like' }}
      </button>
    </div>

  </div>
</template>
