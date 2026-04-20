<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';
import { useSessionStore } from '@/stores/session';
import { ageFromBirthYear } from '@/lib/schema';

const router = useRouter();
const family = useFamilyStore();
const sessionStore = useSessionStore();

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

function discardDraft(childId: string): void {
  const draft = family.draftOf(childId);
  if (!draft) return;
  if (!window.confirm('Supprimer le passage en cours ? Les réponses déjà saisies seront perdues.')) {
    return;
  }
  if (sessionStore.session?.id === draft.id) sessionStore.reset();
  family.deleteSession(childId, draft.id);
}

function removeSession(childId: string, sessionId: string, label: string): void {
  if (!window.confirm(`Supprimer le passage du ${label} ? Cette action est définitive.`)) return;
  family.deleteSession(childId, sessionId);
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
          <p class="text-sm text-ink-700">
            {{ family.completedSessionsOf(child.id).length }} passage(s)
          </p>
        </div>

        <div
          v-if="family.draftOf(child.id)"
          class="mt-4 rounded-petal border border-brand-200 bg-cream-100 p-3"
        >
          <p class="text-sm">
            <span class="font-medium">Passage en cours</span>
            — commencé le {{ formatDate(family.draftOf(child.id)!.date) }}.
          </p>
          <div class="mt-2 flex flex-wrap gap-2">
            <button class="btn-primary" @click="startSession(child.id)">Reprendre</button>
            <button class="btn-ghost text-red-700" @click="discardDraft(child.id)">
              Supprimer le brouillon
            </button>
          </div>
        </div>

        <ul
          v-if="family.completedSessionsOf(child.id).length"
          class="mt-4 space-y-1 text-sm"
        >
          <li
            v-for="s in family.completedSessionsOf(child.id)"
            :key="s.id"
            class="flex items-center justify-between gap-3"
          >
            <RouterLink
              class="underline hover:text-brand-700"
              :to="`/app/enfant/${child.id}/session/${s.id}/synthese`"
            >
              {{ formatDate(s.date) }} · {{ s.questionnaire_version }}
            </RouterLink>
            <div class="flex items-center gap-3">
              <span class="text-ink-700">{{ s.age_at_session }} ans</span>
              <button
                type="button"
                class="text-ink-700 hover:text-red-700"
                :aria-label="`Supprimer le passage du ${formatDate(s.date)}`"
                @click="removeSession(child.id, s.id, formatDate(s.date))"
              >
                ×
              </button>
            </div>
          </li>
        </ul>

        <div class="mt-4 flex flex-wrap gap-2">
          <button
            v-if="!family.draftOf(child.id)"
            class="btn-primary"
            @click="startSession(child.id)"
          >
            Commencer un nouveau passage
          </button>
          <button
            v-if="family.completedSessionsOf(child.id).length >= 2"
            class="btn-secondary"
            @click="compare(child.id)"
          >
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
