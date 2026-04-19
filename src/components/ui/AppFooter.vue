<script setup lang="ts"></script>

<template>
  <footer class="border-t border-brand-100 bg-cream-100 py-8 text-sm text-ink-700">
    <div class="mx-auto flex max-w-5xl flex-col items-start gap-4 px-4 md:flex-row md:items-center md:justify-between">
      <p>
        Un projet de Benjamin (<a class="underline decoration-brand-400 decoration-2 underline-offset-2 hover:text-brand-700" href="https://kolapsis.com" rel="noopener noreferrer">Kolapsis</a>) — FOSS, sans compte, sans tracking.
      </p>
      <nav aria-label="Liens secondaires" class="flex flex-wrap gap-3">
        <RouterLink class="hover:text-brand-700" to="/faq">FAQ</RouterLink>
        <RouterLink class="hover:text-brand-700" to="/a-propos">À propos</RouterLink>
        <a
          class="hover:text-brand-700"
          href="https://github.com/kolapsis/petille"
          rel="noopener noreferrer"
          >Code source</a
        >
        <a
          class="hover:text-brand-700"
          href="https://github.com/kolapsis/petille/blob/main/LICENSE"
          rel="noopener noreferrer"
          >Licence AGPL v3</a
        >
      </nav>
    </div>
  </footer>
</template>
