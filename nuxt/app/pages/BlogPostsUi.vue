<template>
  <div class="container mx-auto p-6 text-white min-h-screen bg-slate-900">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-emerald-400">
        Список постів (Nuxt UI + Пагінація)
      </h1>
      <UButton
        color="emerald"
        icon="i-heroicons-plus"
        @click="navigateTo('/blog/posts/edit-new')"
      >
        Додати статтю
      </UButton>
    </div>

    <UTable :data="tableData" :columns="columns" :loading="pending" class="border border-gray-700 rounded-lg overflow-hidden bg-slate-800">

      <template #title-cell="{ row }">
        <NuxtLink
          :to="'/blog/posts/' + row.original.id"
          class="text-blue-400 hover:text-blue-300 hover:underline font-medium cursor-pointer"
        >
          {{ row.original.title }}
        </NuxtLink>
      </template>

      <template #action-cell="{ row }">
        <UDropdownMenu :items="getDropdownActions(row.original)">
          <UButton
            icon="i-heroicons-ellipsis-horizontal-20-solid"
            color="neutral"
            variant="ghost"
            aria-label="Actions"
          />
        </UDropdownMenu>
      </template>

    </UTable>

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

interface TablePostRow {
  id: number;
  userName: string;
  categoryTitle: string;
  title: string;
  published_at: string;
}

// Колонки суворо за документацією v3
const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'userName', header: 'Автор' },
  { accessorKey: 'categoryTitle', header: 'Категорія' },
  { accessorKey: 'title', header: 'Заголовок' },
  { accessorKey: 'published_at', header: 'Дата публікації' },
  { id: 'action' } // Обов'язковий ID для слоту #action-cell
];

const posts = ref<any>([]);
const page = ref(1);
const totalPosts = ref(0);
const perPage = ref(25);
const pending = ref(false);

// Формування масиву дій через новий параметр onSelect
function getDropdownActions(post: TablePostRow) {
  return [
    [
      {
        label: 'Редагувати текст',
        icon: 'i-heroicons-pencil-square-20-solid',
        onSelect: () => {
          navigateTo(`/blog/posts/edit-${post.id}`);
        }
      },
      {
        label: 'Видалити статтю',
        icon: 'i-heroicons-trash-20-solid',
        color: 'danger' as const,
        onSelect: () => {
          deletePost(post.id);
        }
      }
    ]
  ];
}

const tableData = computed<TablePostRow[]>(() => {
  if (!Array.isArray(posts.value)) return [];

  return posts.value.map((post: Record<string, any>) => ({
    id: post.id,
    userName: post['author_name'] || 'Невідомо',
    categoryTitle: post['category_title'] || 'Без категорії',
    title: post['title'],
    published_at: post['date_published'] || 'Чернетка'
  }));
});

const loadData = async () => {
  pending.value = true;
  try {
    const timestamp = new Date().getTime();
    const url = `http://localhost/api/admin/blog/posts?page=${page.value}&_t=${timestamp}` as string;
    const response = await $fetch<any>(url);

    if (response && response.data) {
      posts.value = response.data;
    } else {
      posts.value = Array.isArray(response) ? response : [];
    }

    totalPosts.value = response?.meta?.total || response?.total || 0;
    perPage.value = response?.meta?.per_page || response?.per_page || 25;
  } catch (error) {
    console.error("Не вдалося завантажити дані:", error);
  } finally {
    pending.value = false;
  }
};

const deletePost = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цей пост?')) return;
  try {
    const url = `http://localhost/api/admin/blog/posts/${id}` as string;
    await $fetch<any>(url, { method: 'DELETE' } as any);
    await loadData();
  } catch (error) {
    console.error("Помилка при видаленні статті:", error);
  }
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadData();
};

loadData();
</script>
