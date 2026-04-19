<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { blogPosts } from '@/content/blog';

const title = "Journal Pétille";
const description =
  "Articles de fond sur l'orientation précoce, les stéréotypes, et la raison d'être de Pétille.";

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ],
});
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <header class="mb-10">
      <h1 class="text-3xl font-bold md:text-4xl">Journal Pétille</h1>
      <p class="mt-2 text-ink-700">
        Des articles courts et sourcés pour comprendre pourquoi ce carnet existe et comment l'utiliser.
      </p>
    </header>

    <ul class="space-y-6">
      <li v-for="post in blogPosts" :key="post.slug" class="card">
        <p class="text-xs uppercase tracking-wide text-brand-700">
          {{ post.date }} · {{ post.tags.join(' · ') }}
        </p>
        <h2 class="mt-2 text-xl font-semibold">
          <RouterLink :to="`/blog/${post.slug}`" class="hover:text-brand-700">
            {{ post.title }}
          </RouterLink>
        </h2>
        <p class="mt-2 text-ink-700">{{ post.description }}</p>
        <RouterLink
          :to="`/blog/${post.slug}`"
          class="mt-3 inline-flex text-sm font-semibold text-brand-700 hover:underline"
          >Lire →</RouterLink
        >
      </li>
    </ul>
  </section>
</template>
