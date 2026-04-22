<script setup>
useHead({
  title: 'Список продуктів'
})

const { data } = await useFetch('/api/products')
</script>

<template>
  <div class="bg-gray-50 min-h-screen p-6 flex flex-wrap gap-6 justify-center text-black">

    <div
      v-for="item in data?.products"
      :key="item.id"
      class="bg-white rounded-xl w-full max-w-[300px] border border-gray-200 hover:shadow-2xl transition"
    >
      <div class="h-1.5 bg-gradient-to-r from-green-500 to-cyan-500"></div>

      <div class="p-6">
        <img :src="item.thumbnail" class="w-full h-[150px] object-cover rounded mb-4"/>

        <h2 class="text-lg font-bold mb-2">{{ item.title }}</h2>

        <p class="text-gray-500 text-sm mb-3">
          {{ item.description }}
        </p>

        <div class="flex justify-between items-center">
          <span class="text-xl font-bold">${{ item.price }}</span>

          <span
            :class="item.rating >= 4.5 ? 'text-green-500' : 'text-red-500'"
            class="font-bold"
          >
            ⭐ {{ item.rating }}
          </span>
        </div>

        <p class="text-xs text-gray-400 mt-2">
          {{ item.brand }} | {{ item.category }}
        </p>
      </div>
    </div>

  </div>
</template>
