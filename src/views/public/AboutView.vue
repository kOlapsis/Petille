<script setup lang="ts">
import { useHead } from '@vueuse/head';
import JsonLd from '@/components/seo/JsonLd.vue';

const title = "À propos — Pétille";
const description =
  "Pétille est un projet de Benjamin (Kolapsis), développeur à Bordeaux. FOSS, zéro backend, données chez vous.";

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
    { property: 'og:type', content: 'profile' },
  ],
});

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Benjamin',
  jobTitle: 'Développeur et architecte freelance',
  url: 'https://kolapsis.com',
  worksFor: { '@type': 'Organization', name: 'Kolapsis' },
  sameAs: ['https://github.com/kolapsis'],
};
</script>

<template>
  <JsonLd :data="jsonLd" />

  <article class="prose prose-lg mx-auto max-w-3xl px-4 py-12">
    <h1>À propos de Pétille</h1>

    <p class="lead">
      Pétille est un carnet d'appétences pour enfants de 6 à 11 ans. Il ne suggère aucun métier.
      Jamais. Il aide à observer ce qui fait vibrer un enfant et à garder la trace dans le temps.
    </p>

    <h2>Pourquoi ce carnet ?</h2>
    <p>
      J'ai deux filles de 6 et 8 ans. Comme beaucoup de parents, j'ai observé qu'elles connaissent
      cinq métiers et que les stéréotypes se fixent vite. J'ai cherché un outil pour garder la
      fenêtre ouverte. Les solutions existantes (Avenir(s), Wilbi, Hello Charly) sont solides mais
      démarrent au collège. Entre 6 et 11 ans, il n'y a rien. Alors je l'ai construit.
    </p>

    <h2>L'auteur</h2>
    <p>
      <strong>Benjamin</strong>, développeur et architecte freelance à Bordeaux. 25 ans dans la
      tech — développeur, lead, architecte. Stack principale : Go, Vue 3, PostgreSQL, Docker. Je
      travaille en freelance sous le nom commercial
      <a href="https://kolapsis.com" rel="noopener">Kolapsis</a> et j'interviens notamment comme CTO
      à temps partiel chez NéoDTX. J'ai aussi 16 ans d'enseignement au CESI et chez Ynov derrière
      moi.
    </p>
    <p>
      Je défends une approche pragmatique de la tech : souveraineté numérique, self-hosting, code
      ouvert, zéro bullshit.
    </p>

    <h2>Ce qui est garanti</h2>
    <ul>
      <li><strong>Aucune suggestion de métier</strong>, à aucun moment.</li>
      <li><strong>Aucun compte, aucun tracking, aucun serveur</strong> n'est requis.</li>
      <li>Les données restent sur votre appareil (stockage local du navigateur).</li>
      <li>Le code est public et auditable, licence AGPLv3.</li>
      <li>Stack européenne, auto-hébergeable sur un seul serveur.</li>
    </ul>

    <h2>Liens</h2>
    <ul>
      <li><a href="https://github.com/kolapsis/petille" rel="noopener">Code source (GitHub)</a></li>
      <li><a href="https://kolapsis.com" rel="noopener">Site Kolapsis</a></li>
      <li>
        <a
          href="https://github.com/kolapsis/petille/blob/main/LICENSE"
          rel="noopener"
          >Licence AGPL v3</a
        >
      </li>
    </ul>
  </article>
</template>
