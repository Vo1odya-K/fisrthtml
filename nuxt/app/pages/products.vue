<script setup>
useHead({
  title: 'Список продуктів'
})

const { data, pending, error } = await useFetch('/api/products')

const search = ref('')
const page = ref(1)
const pageSize = 10

const filtered = computed(() => {
  if (!data.value?.products) return []

  return data.value.products.filter(p =>
    p.title.toLowerCase().includes(search.value.toLowerCase())
  )
})

const paginated = computed(() => {
  const start = (page.value - 1) * pageSize
  return filtered.value.slice(start, start + pageSize)
})

const totalPages = computed(() =>
  Math.ceil(filtered.value.length / pageSize)
)
</script>

<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="max-w-7xl mx-auto bg-white rounded-lg shadow border">

      <!-- HEADER -->
      <div class="p-4 border-b flex justify-between">
        <h1 class="text-xl font-bold">Список продуктів</h1>

        <input
          v-model="search"
          placeholder="Пошук..."
          class="border px-3 py-2 rounded"
        />
      </div>

      <!-- TABLE -->
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead class="bg-gray-50 text-sm text-gray-500">
          <tr>
            <th class="p-3">Фото</th>
            <th class="p-3">Назва</th>
            <th class="p-3">Опис</th>
            <th class="p-3">Ціна</th>
            <th class="p-3">Оцінка</th>
            <th class="p-3">Бренд</th>
            <th class="p-3">Категорія</th>
          </tr>
          </thead>

          <tbody>
          <tr
            v-for="item in paginated"
            :key="item.id"
            class="border-t hover:bg-gray-50"
          >
            <td class="p-3">
              <img :src="item.thumbnail" class="w-[100px] h-[100px] object-cover rounded"/>
            </td>

            <td class="p-3 font-semibold">{{ item.title }}</td>
            <td class="p-3">{{ item.description }}</td>
            <td class="p-3">${{ item.price }}</td>

            <td
              class="p-3 font-bold"
              :class="item.rating >= 4.5 ? 'text-green-500' : 'text-red-500'"
            >
              {{ item.rating }}
            </td>

            <td class="p-3">{{ item.brand }}</td>
            <td class="p-3">{{ item.category }}</td>
          </tr>
          </tbody>
        </table>
      </div>

      <!-- PAGINATION -->
      <div class="p-4 flex justify-center gap-2">
        <button
          v-for="p in totalPages"
          :key="p"
          @click="page = p"
          class="px-3 py-1 border rounded"
          :class="page === p ? 'bg-black text-white' : ''"
        >
          {{ p }}
        </button>
      </div>

    </div>
  </div>
</template>
