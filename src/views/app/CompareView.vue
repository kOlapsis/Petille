<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';
import SessionCompare from '@/components/profile/SessionCompare.vue';

const route = useRoute();
const router = useRouter();
const family = useFamilyStore();

const childId = computed(() => String(route.params.childId));
const child = computed(() => family.childById(childId.value));

const earlierId = ref<string>('');
const laterId = ref<string>('');

onMounted(async () => {
  await family.hydrate();
  if (!child.value) {
    void router.replace('/app/tableau');
    return;
  }
  pickDefaults();
});

watch(childId, pickDefaults);

function pickDefaults(): void {
  const sessions = sortedSessions.value;
  if (sessions.length >= 2) {
    earlierId.value = sessions[sessions.length - 2]!.id;
    laterId.value = sessions[sessions.length - 1]!.id;
  } else if (sessions.length === 1) {
    earlierId.value = sessions[0]!.id;
    laterId.value = sessions[0]!.id;
  }
}

const sortedSessions = computed(() =>
  [...(child.value?.sessions ?? [])]
    .filter((s) => s.completed_at !== null)
    .sort((a, b) => a.date.localeCompare(b.date))
);

const earlier = computed(() => sortedSessions.value.find((s) => s.id === earlierId.value));
const later = computed(() => sortedSessions.value.find((s) => s.id === laterId.value));

const ordered = computed(() => {
  if (!earlier.value || !later.value) return null;
  if (earlier.value.date <= later.value.date) {
    return { earlier: earlier.value, later: later.value };
  }
  return { earlier: later.value, later: earlier.value };
});

const sameSession = computed(() => earlierId.value && earlierId.value === laterId.value);
</script>

<template>
  <section class="mx-auto max-w-4xl px-4 py-12">
    <header class="mb-8">
      <h1 class="text-3xl font-bold">Comparer deux passages</h1>
      <p v-if="child" class="mt-2 text-ink-700">
        {{ child.first_name }} — {{ sortedSessions.length }} passage(s) au carnet.
      </p>
    </header>

    <p v-if="!child" class="text-ink-700">Enfant introuvable.</p>

    <template v-else-if="sortedSessions.length < 2">
      <p class="rounded-petal bg-cream-100 p-4 text-ink-700">
        Il faut au moins deux passages pour comparer. Reviens dans quelques mois ou un an.
      </p>
      <RouterLink to="/app/tableau" class="btn-primary mt-6 inline-flex">Retour au tableau</RouterLink>
    </template>

    <template v-else>
      <div class="card mb-8 grid gap-3 sm:grid-cols-2">
        <label class="block text-sm">
          <span class="font-medium">Premier passage</span>
          <select
            v-model="earlierId"
            class="mt-1 w-full rounded-petal border border-brand-200 px-3 py-2"
          >
            <option v-for="s in sortedSessions" :key="s.id" :value="s.id">
              {{ s.date.slice(0, 10) }} — {{ s.age_at_session }} ans
            </option>
          </select>
        </label>
        <label class="block text-sm">
          <span class="font-medium">Second passage</span>
          <select
            v-model="laterId"
            class="mt-1 w-full rounded-petal border border-brand-200 px-3 py-2"
          >
            <option v-for="s in sortedSessions" :key="s.id" :value="s.id">
              {{ s.date.slice(0, 10) }} — {{ s.age_at_session }} ans
            </option>
          </select>
        </label>
      </div>

      <p
        v-if="sameSession"
        class="mb-6 rounded-petal bg-cream-100 p-3 text-sm italic text-ink-700"
      >
        Choisis deux passages différents pour voir ce qui a bougé.
      </p>

      <SessionCompare
        v-else-if="ordered"
        :child-first-name="child.first_name"
        :earlier="ordered.earlier"
        :later="ordered.later"
      />

      <nav class="mt-10 flex flex-wrap gap-3">
        <RouterLink to="/app/tableau" class="btn-secondary">Retour au tableau</RouterLink>
      </nav>
    </template>
  </section>
</template>
