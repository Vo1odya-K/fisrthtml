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
    >
      <template #actions-cell="{ row }">
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
        :total="totalCategories"
        @update:page="onPageChange"
      />
    </div>

    <UModal v-model="isOpen"  v-if="isOpen" :portal="true">
      <div class="p-6 bg-slate-800 border border-gray-700 rounded-lg text-white" @click.stop @focus.stop>
        <h3 class="text-lg font-bold text-emerald-400 mb-4">
          {{ isEditMode ? 'Редагувати категорію' : 'Створити категорію' }}
        </h3>

        <UForm :state="formState" @submit="onSubmit" class="space-y-4">
          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-300">Назва категорії</label>
            <UInput
              v-model="formState.title"
              placeholder="Введіть назву..."
              autocomplete="one-time-code"
              @keydown.stop
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-300">Слаг (Slug)</label>
            <UInput
              v-model="formState.slug"
              placeholder="slug-category"
              autocomplete="one-time-code"
              @keydown.stop
            />
          </div>

          <div class="space-y-1">
            <label class="block text-sm font-medium text-gray-300">Батьківська категорія (ID)</label>
            <UInput
              v-model.number="formState.parent_id"
              type="number"
              placeholder="0 або ID"
              autocomplete="one-time-code"
              @keydown.stop
            />
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
import { ref, computed } from 'vue';

interface TableCategoryRow {
  id: number;
  title: string;
  slug: string;
  parent_id: number | null;
  parentTitle: string;
}

const toast = useToast();

const columns = [
  { accessorKey: 'id', header: '#' },
  { accessorKey: 'title', header: 'Назва' },
  { accessorKey: 'slug', header: 'Слаг' },
  { accessorKey: 'parentTitle', header: 'Батьківська' },
  { id: 'actions', header: 'Дії' }
];

const categories = ref<any>([]);
const page = ref(1);
const totalCategories = ref(0);
const perPage = ref(5);
const pending = ref(false);

const isOpen = ref(false);
const isEditMode = ref(false);
const formPending = ref(false);

const formState = ref({
  id: undefined as number | undefined,
  title: '',
  slug: '',
  parent_id: null as number | null
});

function getDropdownActions(row: TableCategoryRow) {
  return [
    [
      {
        label: 'Редагувати',
        icon: 'i-heroicons-pencil-square-20-solid',
        onSelect: () => openModalForEdit(row)
      },
      {
        label: 'Видалити',
        icon: 'i-heroicons-trash-20-solid',
        color: 'danger' as const,
        onSelect: () => deleteCategory(row.id)
      }
    ]
  ];
}

const tableData = computed<TableCategoryRow[]>(() => {
  if (!Array.isArray(categories.value)) return [];

  return categories.value.map((cat: Record<string, any>) => ({
    id: cat.id,
    title: cat.title,
    slug: cat.slug || '—',
    parent_id: cat.parent_id,
    parentTitle: cat.parent_category?.title || 'Немає'
  }));
});

const loadData = async () => {
  pending.value = true;
  try {
    const timestamp = new Date().getTime();
    const url = `http://localhost/api/admin/blog/categories?page=${page.value}&_t=${timestamp}`;
    const response = await $fetch<any>(url);

    if (response && response.data) {
      categories.value = response.data;
    } else {
      categories.value = Array.isArray(response) ? response : [];
    }

    totalCategories.value = response?.total || 0;
    perPage.value = response?.per_page || 5;
  } catch (error) {
    console.error("Не вдалося завантажити категорії:", error);
  } finally {
    pending.value = false;
  }
};

const openModalForCreate = () => {
  isEditMode.value = false;
  formState.value = { id: undefined, title: '', slug: '', parent_id: null };
  isOpen.value = true;
};

const openModalForEdit = (row: TableCategoryRow) => {
  isEditMode.value = true;
  formState.value = {
    id: row.id,
    title: row.title,
    slug: row.slug === '—' ? '' : row.slug,
    parent_id: row.parent_id
  };
  isOpen.value = true;
};

const onSubmit = async () => {
  formPending.value = true;
  try {
    const payload = {
      title: formState.value.title,
      slug: formState.value.slug,
      parent_id: Number(formState.value.parent_id) || 0
    };

    const url = isEditMode.value
      ? `http://localhost/api/admin/blog/categories/${formState.value.id}`
      : 'http://localhost/api/admin/blog/categories';

    const method = isEditMode.value ? 'PUT' : 'POST';

    await $fetch<any>(url as string, {
      method: method,
      body: payload
    } as any);

    toast.add({
      title: 'Успіх',
      description: isEditMode.value ? 'Категорію оновлено!' : 'Категорію успішно створено!',
      color: 'success'
    });

    isOpen.value = false;
    await loadData();
  } catch (err: any) {
    console.error("Помилка збереження:", err);
    const laravelErrors = err.data?.errors;
    let errorDescription = err.data?.message || 'Помилка валідації';

    if (laravelErrors) {
      errorDescription = Object.values(laravelErrors).flat().join(', ');
    }

    toast.add({
      title: 'Помилка сервера (422)',
      description: errorDescription,
      color: 'danger'
    });
  } finally {
    formPending.value = false;
  }
};

const deleteCategory = async (id: number) => {
  if (!confirm('Ви впевнені, що хочете видалити цю категорію?')) return;
  try {
    await $fetch<any>(`http://localhost/api/admin/blog/categories/${id}`, {
      method: 'DELETE'
    } as any);

    toast.add({
      title: 'Успіх',
      description: 'Категорію видалено успішно!',
      color: 'success'
    });

    await loadData();
  } catch (error) {
    console.error("Помилка при видаленні:", error);
  }
};

const onPageChange = (newPage: number) => {
  page.value = newPage;
  loadData();
};

loadData();
</script>
