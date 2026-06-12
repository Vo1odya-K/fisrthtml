<template>

  <div class="container">

    <div class="flex justify-center">

      <div class="w-full">

        <nav class="navbar bg-gray-100">

          <a href="/admin/blog/posts/create" class="">Додати</a>

        </nav>

        <div class="card">

          <div class="card-body">

            <table class="table table-auto">

              <thead>

              <tr>

                <th>#</th>

                <th>Автор</th>

                <th>Категорія</th>

                <th>Заголовок</th>

                <th>Дата публікації</th>

              </tr>

              </thead>

              <tbody>
              <tr v-for="post in (posts as any[])" :key="post.id" class="border-b border-gray-700 hover:bg-gray-800">
                <td class="p-2 text-center">{{ post.id }}</td>
                <td class="p-2">{{ post.user?.name || 'Невідомо' }}</td>
                <td class="p-2">{{ post.category?.title || 'Без категорії' }}</td>
                <td class="p-2">
                  <a :href="'/admin/blog/posts/' + post.id + '/edit'" class="text-blue-400 hover:underline">
                    {{ post.title }}
                  </a>
                </td>
                <td class="p-2 text-center">{{ post.published_at || 'Чернетка' }}</td>
              </tr>
              </tbody>
            </table>

          </div>

        </div>

      </div>

    </div>

  </div>

</template>

<script setup lang="ts">
import { ref } from 'vue';

// 1. Замінили кому в кінці рядка на крапку з комою
const posts = ref<any[]>([]);

// 2. Тепер функція оголошується коректно
const getPosts = () => {
  // Додаємо повний шлях до Laravel Sail, щоб уникнути CORS/404 помилок
  $fetch<any>('http://localhost/api/blog/posts')
    .then(response => {
      console.log(response);
      // Записуємо дані у ref
      posts.value = response.data || response;
    })
    .catch(error => {
      console.error("Помилка API:", error);
    });
};

// 3. Викликаємо функцію
getPosts();
</script>
