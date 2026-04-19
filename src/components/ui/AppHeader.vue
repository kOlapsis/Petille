<script setup lang="ts">
import { ref } from 'vue';

const open = ref(false);
</script>

<template>
  <header class="border-b border-brand-100 bg-white/80 backdrop-blur">
    <div class="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
      <RouterLink to="/" class="flex items-center gap-2 text-lg font-bold text-brand-700">
        <span aria-hidden="true" class="text-2xl">✨</span>
        <span>Pétille</span>
      </RouterLink>
      <button
        type="button"
        class="btn-ghost md:hidden"
        :aria-expanded="open"
        aria-controls="main-nav"
        @click="open = !open"
      >
        <span class="sr-only">Menu</span>
        <span aria-hidden="true">☰</span>
      </button>
      <nav
        id="main-nav"
        class="hidden items-center gap-2 md:flex"
        :class="{ '!flex absolute inset-x-0 top-full flex-col bg-white p-4 shadow-soft': open }"
        aria-label="Navigation principale"
      >
        <RouterLink
          class="btn-ghost"
          active-class="bg-brand-50 text-brand-700"
          to="/a-propos"
          @click="open = false"
          >À propos</RouterLink
        >
        <RouterLink
          class="btn-ghost"
          active-class="bg-brand-50 text-brand-700"
          to="/faq"
          @click="open = false"
          >FAQ</RouterLink
        >
        <RouterLink
          class="btn-ghost"
          active-class="bg-brand-50 text-brand-700"
          to="/blog"
          @click="open = false"
          >Journal</RouterLink
        >
        <RouterLink class="btn-primary" to="/app" @click="open = false"
          >Ouvrir mon carnet</RouterLink
        >
      </nav>
    </div>
  </header>
</template>
