<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';

const router = useRouter();
const family = useFamilyStore();

const firstName = ref('');
const currentYear = new Date().getFullYear();
const birthYear = ref<number | null>(null);

const minYear = currentYear - 11;
const maxYear = currentYear - 6;
const yearOptions = computed(() => {
  const out: number[] = [];
  for (let y = maxYear; y >= minYear; y--) out.push(y);
  return out;
});

const formError = ref<string | null>(null);
const submitting = ref(false);

onMounted(async () => {
  await family.hydrate();
  if (!family.family) {
    void router.replace('/app');
  }
});

async function submit(): Promise<void> {
  formError.value = null;
  if (!firstName.value.trim()) {
    formError.value = 'Indique un prénom (ou un surnom).';
    return;
  }
  if (!birthYear.value) {
    formError.value = "Choisis l'année de naissance.";
    return;
  }
  submitting.value = true;
  try {
    family.addChild(firstName.value, birthYear.value);
    await family.flush();
    void router.push('/app/tableau');
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-3xl font-bold">Ajouter un enfant</h1>
    <p class="mt-2 text-ink-700">Juste un prénom (ou surnom) et l'année de naissance.</p>

    <form class="card mt-8 space-y-5" @submit.prevent="submit">
      <div>
        <label for="first-name" class="block text-sm font-semibold">Prénom</label>
        <input
          id="first-name"
          v-model="firstName"
          type="text"
          autocomplete="off"
          required
          maxlength="40"
          class="mt-1 w-full rounded-petal border border-brand-200 px-3 py-2 focus:border-brand-600"
        />
      </div>
      <div>
        <label for="birth-year" class="block text-sm font-semibold">Année de naissance</label>
        <select
          id="birth-year"
          v-model.number="birthYear"
          required
          class="mt-1 w-full rounded-petal border border-brand-200 px-3 py-2 focus:border-brand-600"
        >
          <option :value="null" disabled>Choisis…</option>
          <option v-for="y in yearOptions" :key="y" :value="y">{{ y }}</option>
        </select>
        <p class="mt-1 text-xs text-ink-700">
          Pétille est conçu pour la tranche 6 à 11 ans. Au-delà,
          <a class="underline" href="https://avenirs.onisep.fr" rel="noopener">Avenir(s) (Onisep)</a>
          prend le relais.
        </p>
      </div>
      <p v-if="formError" role="alert" class="rounded-petal bg-red-50 p-3 text-red-800">
        {{ formError }}
      </p>
      <div class="flex justify-end gap-2">
        <RouterLink to="/app/tableau" class="btn-ghost">Annuler</RouterLink>
        <button type="submit" class="btn-primary" :disabled="submitting">Ajouter</button>
      </div>
    </form>
  </section>
</template>
