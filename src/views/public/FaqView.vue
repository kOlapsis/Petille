<script setup lang="ts">
import { useHead } from '@vueuse/head';
import JsonLd from '@/components/seo/JsonLd.vue';

const title = "FAQ — Pétille";
const description =
  "Réponses aux questions fréquentes sur Pétille : à quoi ça sert, où vont les données, est-ce un test d'orientation.";

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: title },
    { property: 'og:description', content: description },
  ],
});

interface Qa {
  q: string;
  a: string;
}

const qas: Qa[] = [
  {
    q: 'À quoi sert Pétille ?',
    a: "À garder une trace de ce qui fait vibrer un enfant entre 6 et 11 ans. Une fois par an, on remplit le carnet. On compare d'une année sur l'autre. On ne cherche pas à décider pour lui, on l'aide à s'observer.",
  },
  {
    q: 'Est-ce un test d\u2019orientation ?',
    a: "Non. Pétille ne mappe jamais une réponse vers un métier. Il n'y a pas de résultat du type « ton enfant est fait pour X ». On affiche un profil d'appétences : univers préférés, façons de faire, contexte. C'est un point de départ pour discuter, pas un verdict.",
  },
  {
    q: 'À quel âge l\u2019utiliser ?',
    a: 'Entre 6 et 11 ans. Deux questionnaires distincts : 6-8 ans (paires d\'images, choix simples) et 9-11 ans (échelles de 0 à 3, texte libre). Avant 6 ans, les enfants ne se projettent pas encore vraiment. Après 11-12 ans, les outils spécialisés (Avenir(s), Wilbi, Hello Charly) prennent le relais.',
  },
  {
    q: 'Où vont mes données ?',
    a: "Nulle part. Tout est stocké localement dans votre navigateur (IndexedDB). Aucun compte, aucun serveur, aucun tracking. Vous pouvez exporter un fichier JSON (au choix chiffré par phrase secrète) pour sauvegarder ou transférer vers un autre appareil.",
  },
  {
    q: 'Est-ce que l\u2019outil suggère un métier à mon enfant ?',
    a: "Non, jamais. C'est la règle fondatrice du projet : aucune suggestion de métier, quelle que soit la réponse. Le nom de fichier commercial peut évoquer « les métiers », mais c'est uniquement pour atteindre les parents qui cherchent. L'outil lui-même reste un carnet d'observation.",
  },
  {
    q: 'Quelle différence avec Avenir(s), Wilbi, Hello Charly ?',
    a: 'Ces outils sont excellents mais commencent au collège (à partir de 11-12 ans) et proposent des recommandations de métiers. Pétille se positionne avant, sur la tranche 6-11 ans, sans jamais proposer de métier. C\'est un outil complémentaire, pas concurrent.',
  },
  {
    q: 'Combien de temps ça prend ?',
    a: 'Entre 15 et 30 minutes selon l\'âge et le rythme. Il est tout à fait possible de faire pause et de reprendre plus tard : le carnet s\'enregistre automatiquement.',
  },
  {
    q: 'Puis-je installer Pétille sur mon téléphone ?',
    a: 'Oui. Pétille est une PWA : depuis le navigateur mobile (Safari iOS ou Chrome Android), vous pouvez l\'ajouter à l\'écran d\'accueil. L\'app fonctionne ensuite hors-ligne.',
  },
  {
    q: 'Puis-je l\u2019auto-héberger ?',
    a: 'Oui. Le code est FOSS (AGPLv3). Un Dockerfile et un docker-compose sont fournis, avec labels Traefik pour HTTPS automatique. Un petit VPS suffit.',
  },
  {
    q: 'L\u2019outil est-il accessible aux enfants en situation de handicap ?',
    a: 'C\'est une cible explicite : conformité WCAG AA, focus visible, bouton « lire à voix haute », contrastes élevés, police Atkinson Hyperlegible (conçue pour dyslexie et basse vision), respect de prefers-reduced-motion.',
  },
];

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: qas.map((qa) => ({
    '@type': 'Question',
    name: qa.q,
    acceptedAnswer: { '@type': 'Answer', text: qa.a },
  })),
};
</script>

<template>
  <JsonLd :data="jsonLd" />

  <article class="prose prose-lg mx-auto max-w-3xl px-4 py-12">
    <h1>Questions fréquentes</h1>
    <section v-for="qa in qas" :key="qa.q">
      <h2>{{ qa.q }}</h2>
      <p>{{ qa.a }}</p>
    </section>
  </article>
</template>
