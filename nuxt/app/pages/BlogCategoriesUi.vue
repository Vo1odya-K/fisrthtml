<template>
  <div class="container mx-auto p-6 text-white min-h-screen bg-slate-900">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold text-emerald-400">
        Керування категоріями блогу (CRUD)
      </h1>
      <UButton
        color="emerald"
        icon="i-heroicons-plus"
        @click="openModalForCreate"
      >
        Додати категорію
      </UButton>
    </div>

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
        :total="totalItems"
        @update:page="onPageChange"
      />
    </div>

    <UModal v-model="isOpen">
      <div class="p-6 bg-slate-800 border border-gray-700 rounded-lg text-white">
        <h3 class="text-lg font-bold text-emerald-400 mb-4">
          {{ isEditMode ? 'Редагувати категорію' : 'Створити категорію' }}
        </h3>

        <UForm :schema="(schema as any)" :state="formState" @submit="onSubmit" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-300">Назва категорії</label>
            <UInput v-model="formState.title" placeholder="Введіть назву..." />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-300">Слаг (Slug)</label>
            <UInput v-model="formState.slug" placeholder="slug-category" />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-300">Батьківська категорія (ID)</label>
            <UInput v-model.number="formState.parent_id" type="number" placeholder="0 або ID" />
          </div>

          <div class="flex justify-end gap-3 pt-2">
            <UButton color="gray" variant="ghost" @click="isOpen = false">Скасувати</UButton>
            <UButton type="submit" color="emerald" :loading="formPending">Зберегти</UButton>
          </div>
        </UForm>
      </div>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, h } from 'vue';
import { z } from 'zod';

// 1. Схема валідації Zod
const schema = z.object({
  title: z.string().min(3, { message: 'Назва повинна мати мінімум 3 символи' }),
  slug: z.string().min(3, { message: 'Слаг повинен мати мінімум 3 символи' }),
  parent_id: z.number().int().optional().nullable()
});

// Визначаємо гнучкий інтерфейс для стану форми
interface CategoryFormState {
  id?: number;
  title: string;
  slug: string;
  parent_id: number | null;
}

// Конфіг колонок таблиці
const columns: Record<string, any>[] = [
  { id: 'id', accessorKey: 'id', header: '#' },
  { id: 'title', accessorKey: 'title', header: 'Назва' },
  { id: 'slug', accessorKey: 'slug', header: 'Слаг' },
  { id: 'parent', accessorKey: 'parent_title', header: 'Батьківська' },
  {
    id: 'actions',
    header: 'Дії',
    cell: ({ row }: any) => {
      const items = [
        [
          {
            label: 'Редагувати',
            icon: 'i-heroicons-pencil-square-20-solid',
            click: () => openModalForEdit(row.original)
          },
          {
            label: 'Видалити',
            icon: 'i-heroicons-trash-20-solid',
            class: 'text-red-400 hover:text-red-300',
            click: () => deleteCategory(row.original.id)
          }
        ]
      ];

      // Використовуємо рядкові назви для динамічного рендерингу компонентів через h()
      // Це миттєво прибирає Cannot resolve symbol 'UDropdown'
      return h(
        'UDropdown',
        { items, popper: { placement: 'bottom-start' } },
        () => h('UButton', { color: 'gray', variant: 'ghost', icon: 'i-heroicons-ellipsis-horizontal-20-solid' })
      );
    }
  }
];

const categories = ref<any[]>([]);
const page = ref(1);
const totalItems = ref(0);
const perPage = ref(25);
const pending = ref(false);

const isOpen = ref(false);
const isEditMode = ref(false);
const formPending = ref(false);

const formState = ref<CategoryFormState>({
  title: '',
  slug: '',
  parent_id: null
});

const tableData = computed(() => {
  if (!Array.isArray(categories.value)) return [];
  return categories.value.map(cat => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug,
    parent_id: cat.parent_id,
    parent_title: cat.parent_title || 'Немає'
  }));
});

const loadCategories = async () => {
  pending.value = true;
  try {
    const timestamp = new Date().getTime();
    // Явно кастимо url як string, щоб прибрати помилку NitroFetchOptions
    const url = `http://localhost/api/admin/blog/categories?page=${page.value}&_t=${timestamp}` as string;
    const response = await $fetch<any>(url);

    categories.value = response.data || response;
    totalItems.value = response.meta?.total || response.total || 0;
    perPage.value = response.meta?.per_page || response.per_page || 25;
  } catch (err) {
    console.error("Помилка при завантаженні категорій:", err);
  } finally {
    pending.value = false;
  }
};

const openModalForCreate = () => {
  isEditMode.value = false;
  formState.value = { title: '', slug: '', parent_id: null };
  isOpen.value = true;
};

const openModalForEdit = (row: any) => {
  isEditMode.value = true;
  formState.value = {
    id: row.id,
    title: row.title,
    slug: row.slug,
    parent_id: row.parent_id !== undefined ? row.parent_id : null
  };
  isOpen.value = true;
};

const onSubmit = async () => {
  formPending.value = true;
  try {
    if (isEditMode.value && formState.value.id) {
      const url = `http://localhost/api/admin/blog/categories/${formState.value.id}` as string;
      await $fetch<any>(url, {
        method: 'PUT',
        body: formState.value
      } as any);
    } else {
      const url = 'http://localhost/api/admin/blog/categories' as string;
      await $fetch<any>(url, {
        method: 'POST',
        body: formState.value
      } as any);
    }
    isOpen.value = false;
    await loadCategories();
  } catch (err) {
    console.error("Помилка збереження форми:", err);
  } finally {
    formPending.value = false;
  }
};

const deleteCategory = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return;
  try {
    const url = `http://localhost/api/admin/blog/categories/${id}` as string;
    await $fetch<any>(url, {
      method: 'DELETE'
    } as any);
    await loadCategories();
  } catch (err) {
    console.error("Помилка при видаленні:", err);
  }
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadCategories();
};

loadCategories();
</script>
