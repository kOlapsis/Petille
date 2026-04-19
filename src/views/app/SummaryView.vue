<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';
import ProfileSummary from '@/components/profile/ProfileSummary.vue';
import { resolveQuestionnaire } from '@/content/questionnaires';

const route = useRoute();
const router = useRouter();
const family = useFamilyStore();

onMounted(async () => {
  await family.hydrate();
  if (!family.family) void router.replace('/app');
});

const child = computed(() => family.childById(String(route.params.childId)));
const session = computed(() =>
  child.value?.sessions.find((s) => s.id === String(route.params.sessionId))
);

const closingText = computed(() => {
  if (!session.value) return '';
  return resolveQuestionnaire(session.value.questionnaire_version).adultClosing;
});
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <p v-if="!session" class="text-ink-700">Synthèse introuvable.</p>
    <template v-else>
      <ProfileSummary :session="session" :child-first-name="child!.first_name" />

      <aside class="card mt-10 border-brand-300 bg-cream-100">
        <h3 class="text-lg font-semibold">À l'adulte qui lit ça</h3>
        <p class="mt-2 italic text-ink-700">{{ closingText }}</p>
      </aside>

      <nav class="mt-8 flex flex-wrap gap-3">
        <RouterLink to="/app/tableau" class="btn-primary">Retour au tableau</RouterLink>
        <RouterLink :to="`/app/enfant/${child!.id}/comparer`" class="btn-secondary">
          Comparer avec un autre passage
        </RouterLink>
        <RouterLink to="/app/export" class="btn-ghost">Sauvegarder le carnet</RouterLink>
      </nav>
    </template>
  </section>
</template>
