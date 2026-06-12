<template>
  <div class="container mx-auto p-6 text-white min-h-screen bg-slate-900">
    <h1 class="text-2xl font-bold mb-6 text-center text-emerald-400">
      Список постів (Nuxt UI + Пагінація)
    </h1>

    <UTable
      :data="tableData"
      :columns="columns"
      :loading="pending"
      class="border border-gray-700 rounded-lg overflow-hidden bg-slate-800"
    />

    <div class="flex justify-center mt-6 border-t border-gray-700 pt-4">
      <UPagination
        :page="page"
        :items-per-page="perPage"
        :total="totalPosts"
        @update:page="onPageChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const columns = [
  { id: 'id', accessorKey: 'id', header: '#' },
  { id: 'user', accessorKey: 'userName', header: 'Автор' },
  { id: 'category', accessorKey: 'categoryTitle', header: 'Категорія' },
  { id: 'title', accessorKey: 'title', header: 'Заголовок' },
  { id: 'published_at', accessorKey: 'published_at', header: 'Дата публікації' }
];

const posts = ref<any[]>([]);
const page = ref(1);
const totalPosts = ref(0);
const perPage = ref(25);
const pending = ref(false);

const tableData = computed(() => {
  return posts.value.map(post => ({
    id: post.id,
    userName: post.user?.name || 'Невідомо',
    categoryTitle: post.category?.title || 'Без категорії',
    title: post.title,
    published_at: post.published_at || 'Чернетка'
  }));
});

const loadData = async () => {
  pending.value = true;
  try {
    const timestamp = new Date().getTime();
    const response = await $fetch<any>(`http://localhost/api/blog/posts?page=${page.value}&_t=${timestamp}`);

    posts.value = response.data || response;
    totalPosts.value = response.total || 0;
    perPage.value = response.per_page || 25;

    console.log(`Завантажено сторінку №${page.value}, отримано постів:`, posts.value.length);
  } catch (error) {
    console.error("Не вдалося завантажити дані для Nuxt UI:", error);
  } finally {
    pending.value = false;
  }
};

// Функція-хендлер, яка залізобетонно спрацює при кліку на будь-яку цифру пагінації
const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadData();
};

// Перший запуск при завантаженні сторінки
loadData();
</script>
