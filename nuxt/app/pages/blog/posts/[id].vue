<template>
  <div class="container mx-auto p-6 text-white min-h-screen bg-slate-900">
    <div class="mb-6">
      <NuxtLink to="/BlogPostsUi" class="text-emerald-400 hover:underline font-medium flex items-center gap-2">
        ← Назад до списку
      </NuxtLink>
    </div>

    <div v-if="pending" class="text-center text-xl text-gray-400 animate-pulse py-12">
      Завантаження вмісту поста...
    </div>

    <div v-else-if="data" class="bg-slate-800 p-8 rounded-lg border border-gray-700 shadow-xl max-w-3xl mx-auto">
      <h1 class="text-3xl font-extrabold mb-4 text-emerald-400 leading-tight">
        {{ data.title }}
      </h1>

      <div class="flex flex-wrap gap-4 text-sm text-gray-400 mb-6 border-b border-gray-700 pb-4">
        <div>Автор: <span class="text-emerald-300 font-medium">{{ data.userName }}</span></div>
        <div>Категорія: <span class="text-blue-400 font-medium">{{ data.categoryTitle }}</span></div>
        <div>Створено: <span class="text-gray-300">{{ data.date }}</span></div>
      </div>

      <div class="text-gray-300 leading-relaxed text-lg whitespace-pre-line">
        {{ data.content }}
      </div>
    </div>

    <div v-else class="text-center text-red-400 text-xl py-12">
      Помилка: Не вдалося знайти або завантажити цей пост.
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const id = route.params.id;

// Використовуємо тип any, щоб вимкнути застарілу перевірку властивостей з боку IDE
const post = ref<any>(null);
const pending = ref(true);

// Безпечний мапінг нових полів із Laravel PostResource за допомогою строкових ключів
const data = computed(() => {
  if (!post.value) return null;

  return {
    title: post.value['title'] || 'Без назви',
    userName: post.value['author_name'] || 'Невідомо',
    categoryTitle: post.value['category_title'] || 'Без категорії',
    date: post.value['date_published']
      ? new Date(post.value['date_published']).toLocaleDateString()
      : 'Чернетка',
    content: post.value['content_html'] || post.value['content_raw'] || 'Текст поста порожній.'
  };
});

const loadPost = async () => {
  try {
    const response = await $fetch<any>(`http://localhost/api/blog/posts/${id}`);
    // Мапимо response.data, оскільки Laravel API Resource обгортає модель у цей ключ
    post.value = response.data || response;
  } catch (error) {
    console.error("Помилка при завантаженні статті:", error);
  } finally {
    pending.value = false;
  }
};

loadPost();
</script>
