<template>
  <div class="container mx-auto p-6 text-white min-h-screen bg-slate-900">
    <div class="mb-6">
      <NuxtLink to="/BlogPostsUi" class="text-emerald-400 hover:underline font-medium flex items-center gap-2">
        ← Назад до списку статей
      </NuxtLink>
    </div>

    <div class="bg-slate-800 p-8 rounded-lg border border-gray-700 shadow-xl max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold text-emerald-400 mb-6">
        {{ isEditMode ? 'Редагувати статтю' : 'Створити нову статтю' }}
      </h1>

      <UForm :schema="(schema as any)" :state="formState" @submit="onSubmit" class="space-y-4">
        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">Заголовок статті</label>
          <UInput v-model="formState.title" placeholder="Введіть заголовок..." />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">Слаг (Slug)</label>
          <UInput v-model="formState.slug" placeholder="post-slug-url" />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">ID Категорії</label>
          <UInput v-model.number="formState.category_id" type="number" placeholder="Введіть ID категорії" />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">Короткий текст (Raw)</label>
          <UTextarea v-model="formState.content_raw" rows="4" placeholder="Текст статті..." />
        </div>

        <div class="space-y-1">
          <label class="block text-sm font-medium text-gray-300">HTML контент (за наявності)</label>
          <UTextarea v-model="formState.content_html" rows="4" placeholder="HTML текст..." />
        </div>

        <div class="flex items-center gap-2 py-2">
          <input type="checkbox" v-model="formState.is_published" id="is_published" class="rounded bg-slate-700 border-gray-600 text-emerald-500 focus:ring-emerald-500" />
          <label for="is_published" class="text-sm font-medium text-gray-300 cursor-pointer">Опублікувати статтю</label>
        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-700">
          <UButton color="gray" variant="ghost" @click="navigateTo('/BlogPostsUi')">Скасувати</UButton>
          <UButton type="submit" color="emerald" :loading="formPending">Зберегти статтю</UButton>
        </div>
      </UForm>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { z } from 'zod';

const route = useRoute();
const paramId = route.params.id as string;
const isEditMode = ref(paramId !== 'new');

const formPending = ref(false);

// Виправлена валідація Zod (чистий number без конфлікту параметрів)
const schema = z.object({
  title: z.string().min(5, { message: 'Заголовок має бути не менше 5 символів' }),
  slug: z.string().min(5, { message: 'Слаг має бути не менше 5 символів' }),
  category_id: z.number().int({ message: 'Обов’язково вкажіть ID категорії цифрами' }),
  content_raw: z.string().min(10, { message: 'Текст статті має бути не менше 10 символів' }),
  content_html: z.string().optional().nullable(),
  is_published: z.boolean()
});

interface PostFormState {
  title: string;
  slug: string;
  category_id: number | null;
  content_raw: string;
  content_html: string;
  is_published: boolean;
  user_id: number;
}

const formState = ref<PostFormState>({
  title: '',
  slug: '',
  category_id: null,
  content_raw: '',
  content_html: '',
  is_published: false,
  user_id: 1
});

onMounted(async () => {
  if (isEditMode.value) {
    try {
      const response = await $fetch<any>(`http://localhost/api/admin/blog/posts/${paramId}`);
      const post = response.data || response;

      formState.value = {
        title: post.title || '',
        slug: post.slug || '',
        category_id: post.category_id || null,
        content_raw: post.content_raw || '',
        content_html: post.content_html || '',
        is_published: !!post.is_published,
        user_id: post.user_id || 1
      };
    } catch (err) {
      console.error("Помилка завантаження поста:", err);
    }
  }
});

const onSubmit = async () => {
  formPending.value = true;
  try {
    if (isEditMode.value) {
      const url = `http://localhost/api/admin/blog/posts/${paramId}` as string;
      await $fetch<any>(url, {
        method: 'PUT',
        body: formState.value
      } as any);
    } else {
      const url = 'http://localhost/api/admin/blog/posts' as string;
      await $fetch<any>(url, {
        method: 'POST',
        body: formState.value
      } as any);
    }

    navigateTo('/BlogPostsUi');
  } catch (err) {
    console.error("Помилка збереження поста:", err);
  } finally {
    formPending.value = false;
  }
};
</script>
