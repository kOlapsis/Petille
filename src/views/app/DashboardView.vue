<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';
import { ageFromBirthYear } from '@/lib/schema';

const router = useRouter();
const family = useFamilyStore();

onMounted(async () => {
  await family.hydrate();
  if (!family.family) void router.replace('/app');
});

const children = computed(() => family.children);

function startSession(childId: string): void {
  void router.push(`/app/enfant/${childId}/session`);
}

function compare(childId: string): void {
  void router.push(`/app/enfant/${childId}/comparer`);
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <header class="flex items-end justify-between gap-4">
      <div>
        <h1 class="text-3xl font-bold">Mon carnet</h1>
        <p class="mt-1 text-ink-700">Un passage par an, idéalement à la rentrée ou à l'anniversaire.</p>
      </div>
      <RouterLink to="/app/enfant/nouveau" class="btn-primary">Ajouter un enfant</RouterLink>
    </header>

    <p v-if="!children.length" class="card mt-8">
      Aucun enfant enregistré pour le moment. Commence par en ajouter un.
    </p>

    <ul v-else class="mt-8 space-y-4">
      <li v-for="child in children" :key="child.id" class="card">
        <div class="flex flex-wrap items-baseline justify-between gap-2">
          <h2 class="text-2xl font-semibold text-brand-700">
            {{ child.first_name }}
            <span class="text-base font-normal text-ink-700"
              >· {{ ageFromBirthYear(child.birth_year) }} ans</span
            >
          </h2>
          <p class="text-sm text-ink-700">{{ child.sessions.length }} passage(s)</p>
        </div>

        <ul v-if="child.sessions.length" class="mt-4 space-y-1 text-sm">
          <li v-for="s in child.sessions" :key="s.id" class="flex justify-between">
            <RouterLink
              class="underline hover:text-brand-700"
              :to="`/app/enfant/${child.id}/session/${s.id}/synthese`"
            >
              {{ formatDate(s.date) }} · {{ s.questionnaire_version }}
            </RouterLink>
            <span class="text-ink-700">{{ s.age_at_session }} ans</span>
          </li>
        </ul>

        <div class="mt-4 flex flex-wrap gap-2">
          <button class="btn-primary" @click="startSession(child.id)">
            Commencer un nouveau passage
          </button>
          <button v-if="child.sessions.length >= 2" class="btn-secondary" @click="compare(child.id)">
            Comparer deux passages
          </button>
        </div>
      </li>
    </ul>

    <footer class="mt-10 flex justify-between text-sm">
      <RouterLink class="underline hover:text-brand-700" to="/app/export"
        >Sauvegarder mon carnet</RouterLink
      >
    </footer>
  </section>
</template>
