<script setup lang="ts">
import { useRouter } from 'vue-router'
import welcomeImg from '@/assets/welcome.webp'
const router = useRouter()
</script>

<template>
  <div class="flex flex-col items-center min-h-screen bg-white pb-5 px-4 max-w-4xl mx-auto">

    <img 
      :src="welcomeImg" 
      alt="Meet new people"
      class="mt-8 w-full h-[40vh] object-contain"
    />

    <h2 class="bg-red-500 text-white py-3 px-6 rounded-md uppercase tracking-wide text-lg mb-5">
      Meet New People
    </h2>

    <p class="text-center max-w-xl text-gray-600 text-sm leading-relaxed mb-10">
      Вітаємо у нашому застосунку для знайомств!
      Тут ви можете знайти нових людей, поспілкуватися, лайкати профілі
      та заводити нові знайомства.
    </p>

    <button
      @click="router.push('/register')"
      class="bg-red-500 text-white text-lg px-8 py-3 rounded-lg shadow-md mt-auto mb-8"
    >
      START
    </button>

  </div>
</template>
