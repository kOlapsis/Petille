<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useHead } from '@vueuse/head';
import { findPost } from '@/content/blog';
import JsonLd from '@/components/seo/JsonLd.vue';

const route = useRoute();
const post = computed(() => findPost(String(route.params.slug)));

useHead(() => ({
  title: post.value ? `${post.value.title} — Pétille` : 'Article — Pétille',
  meta: post.value
    ? [
        { name: 'description', content: post.value.description },
        { property: 'og:title', content: post.value.title },
        { property: 'og:description', content: post.value.description },
        { property: 'og:type', content: 'article' },
        { property: 'article:published_time', content: post.value.date },
        { property: 'article:author', content: post.value.author },
      ]
    : [],
}));

const jsonLd = computed(() =>
  post.value
    ? {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.value.title,
        description: post.value.description,
        author: { '@type': 'Person', name: post.value.author },
        datePublished: post.value.date,
        inLanguage: 'fr-FR',
        keywords: post.value.tags.join(', '),
      }
    : null
);
</script>

<template>
  <article v-if="post" class="prose prose-lg mx-auto max-w-3xl px-4 py-12">
    <JsonLd v-if="jsonLd" :data="jsonLd" />
    <p class="text-sm uppercase tracking-wide text-brand-700">
      {{ post.date }} · {{ post.tags.join(' · ') }}
    </p>
    <h1 class="mt-2">{{ post.title }}</h1>
    <p class="lead">{{ post.description }}</p>
    <!-- eslint-disable-next-line vue/no-v-html -- HTML pré-assaini via DOMPurify dans content/pages -->
    <div v-html="post.html" />

    <hr class="my-10" />
    <p class="text-sm">
      Écrit par {{ post.author }}.
      <RouterLink to="/blog" class="underline decoration-brand-400 underline-offset-2">Tous les articles</RouterLink>
      · <RouterLink to="/app" class="underline decoration-brand-400 underline-offset-2">Ouvrir mon carnet</RouterLink>
    </p>
  </article>

  <section v-else class="mx-auto max-w-3xl px-4 py-12">
    <h1 class="text-2xl font-bold">Article introuvable</h1>
    <p class="mt-3 text-ink-700">
      Cet article n'existe pas (encore). <RouterLink to="/blog" class="btn-ghost">Retour au journal</RouterLink>
    </p>
  </section>
</template>
