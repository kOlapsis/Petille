<script setup lang="ts">
import { useHead } from '@vueuse/head';
import JsonLd from '@/components/seo/JsonLd.vue';

const title = "Pétille — Carnet d'appétences pour enfants de 6 à 11 ans";
const description =
  "Pétille aide les enfants de 6 à 11 ans à découvrir ce qui les fait vibrer — sans compte, sans tracking, sans aucun métier suggéré.";

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: 'Pétille — Ce qui fait briller ton enfant' },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'fr_FR' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ],
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SoftwareApplication',
  name: 'Pétille',
  applicationCategory: 'EducationalApplication',
  operatingSystem: 'Any (PWA)',
  offers: { '@type': 'Offer', price: '0', priceCurrency: 'EUR' },
  description,
  inLanguage: 'fr-FR',
  audience: {
    '@type': 'PeopleAudience',
    suggestedMinAge: 6,
    suggestedMaxAge: 11,
  },
  author: {
    '@type': 'Person',
    name: 'Benjamin TOUCHARD',
    url: 'https://kolapsis.com',
  },
  license: 'https://www.gnu.org/licenses/agpl-3.0.html',
};
</script>

<template>
  <JsonLd :data="jsonLd" />

  <section class="mx-auto max-w-5xl px-4 py-16 text-center">
    <p class="text-sm font-semibold uppercase tracking-widest text-brand-700">
      Pour les 6 à 11 ans · Sans compte · Sans tracking
    </p>
    <h1 class="mt-4 text-4xl font-extrabold leading-tight text-ink-900 md:text-6xl">
      Ce qui <span class="text-brand-600">fait briller</span> ton enfant.
    </h1>
    <p class="mx-auto mt-6 max-w-2xl text-lg text-ink-700">
      Pétille est un carnet d'appétences à remplir une fois par an. On observe ce qui te fait vibrer,
      on garde la trace, on compare l'année suivante.
      <strong>Aucun métier n'est jamais suggéré.</strong>
    </p>
    <div class="mt-8 flex flex-wrap justify-center gap-3">
      <RouterLink to="/app" class="btn-primary">Ouvrir mon carnet</RouterLink>
      <RouterLink to="/a-propos" class="btn-secondary">Pourquoi Pétille ?</RouterLink>
    </div>
  </section>

  <section class="mx-auto max-w-5xl px-4 py-12">
    <h2 class="text-center text-2xl font-bold">Comment ça marche</h2>
    <div class="mt-8 grid gap-6 md:grid-cols-3">
      <article class="card">
        <p class="text-3xl" aria-hidden="true">🌱</p>
        <h3 class="mt-2 text-lg font-semibold">1. Une fois par an</h3>
        <p class="mt-2 text-sm text-ink-700">
          L'enfant répond à quelques questions simples, adaptées à son âge (6-8 ou 9-11). Compter 20 à
          30 minutes.
        </p>
      </article>
      <article class="card">
        <p class="text-3xl" aria-hidden="true">📓</p>
        <h3 class="mt-2 text-lg font-semibold">2. Un portrait à cet instant</h3>
        <p class="mt-2 text-sm text-ink-700">
          Pas de métier suggéré. Un profil d'appétences : univers, façons de faire, contexte préféré.
        </p>
      </article>
      <article class="card">
        <p class="text-3xl" aria-hidden="true">🪞</p>
        <h3 class="mt-2 text-lg font-semibold">3. On compare l'année suivante</h3>
        <p class="mt-2 text-sm text-ink-700">
          Ce qui reste stable devient une piste. Ce qui change est normal. Aucune obligation de choisir.
        </p>
      </article>
    </div>
  </section>

  <section class="mx-auto max-w-3xl px-4 py-12">
    <h2 class="text-2xl font-bold">Ce que Pétille n'est pas</h2>
    <ul class="mt-4 space-y-2 text-ink-700">
      <li>· <strong>Pas</strong> un test d'orientation : on ne mappe jamais une réponse vers un métier.</li>
      <li>· <strong>Pas</strong> un service en ligne : aucune donnée ne quitte votre appareil.</li>
      <li>· <strong>Pas</strong> un abonnement : FOSS (AGPLv3), gratuit, sans compte.</li>
      <li>· <strong>Pas</strong> un outil de performance : pas de chrono, pas de score à battre.</li>
    </ul>
    <div class="mt-8">
      <RouterLink to="/faq" class="btn-ghost">Questions fréquentes →</RouterLink>
    </div>
  </section>
</template>
