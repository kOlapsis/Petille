<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';
import { importFamily, InvalidFamilyJsonError, PassphraseRequiredError } from '@/lib/exporters/importJson';

const router = useRouter();
const family = useFamilyStore();

const importError = ref<string | null>(null);
const passphraseRequired = ref(false);
const passphrase = ref('');
const pendingRaw = ref<string | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);

onMounted(async () => {
  await family.hydrate();
  if (family.family) {
    void router.replace('/app/tableau');
  }
});

function startFresh(): void {
  family.createFamily();
  void router.push('/app/enfant/nouveau');
}

async function applyImport(raw: string, withPassphrase?: string): Promise<void> {
  try {
    const imported = await importFamily(raw, { passphrase: withPassphrase });
    family.replaceFamily(imported);
    await family.flush();
    void router.push('/app/tableau');
  } catch (err) {
    if (err instanceof PassphraseRequiredError) {
      pendingRaw.value = raw;
      passphraseRequired.value = true;
      importError.value = null;
      return;
    }
    if (err instanceof InvalidFamilyJsonError) {
      importError.value = err.message;
      return;
    }
    importError.value = err instanceof Error ? err.message : 'Erreur inconnue.';
  }
}

async function onFileChosen(event: Event): Promise<void> {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  if (!file) return;
  const raw = await file.text();
  await applyImport(raw);
  target.value = '';
}

async function submitPassphrase(): Promise<void> {
  if (!pendingRaw.value) return;
  await applyImport(pendingRaw.value, passphrase.value);
  passphrase.value = '';
}
</script>

<template>
  <section class="mx-auto max-w-2xl px-4 py-12">
    <h1 class="text-3xl font-bold">Ton carnet famille</h1>
    <p class="mt-3 text-ink-700">
      Pétille fonctionne sans compte. Tes données restent dans ce navigateur.
      Tu peux exporter ton carnet quand tu veux pour le sauvegarder dans ton cloud personnel.
    </p>

    <div class="mt-8 grid gap-4 md:grid-cols-2">
      <button class="card text-left transition hover:shadow-soft" @click="startFresh">
        <h2 class="text-xl font-semibold text-brand-700">Créer un nouveau carnet</h2>
        <p class="mt-2 text-sm text-ink-700">
          Pour démarrer de zéro. Tu pourras ajouter un ou plusieurs enfants.
        </p>
      </button>
      <div class="card">
        <h2 class="text-xl font-semibold text-brand-700">Ouvrir un carnet existant</h2>
        <p class="mt-2 text-sm text-ink-700">
          Charger un fichier <code>.json</code> précédemment exporté.
        </p>
        <button class="btn-secondary mt-4" type="button" @click="fileInput?.click()">
          Choisir un fichier
        </button>
        <input
          ref="fileInput"
          type="file"
          accept="application/json,.json"
          class="sr-only"
          @change="onFileChosen"
        />
      </div>
    </div>

    <div v-if="passphraseRequired" class="card mt-6">
      <h2 class="text-lg font-semibold">Ce fichier est chiffré</h2>
      <p class="mt-1 text-sm text-ink-700">Saisis la passphrase utilisée à l'export.</p>
      <form class="mt-4 flex gap-2" @submit.prevent="submitPassphrase">
        <label class="sr-only" for="passphrase">Passphrase</label>
        <input
          id="passphrase"
          v-model="passphrase"
          type="password"
          autocomplete="off"
          class="flex-1 rounded-petal border border-brand-200 px-3 py-2 focus:border-brand-600"
        />
        <button class="btn-primary" type="submit">Déchiffrer</button>
      </form>
    </div>

    <p v-if="importError" role="alert" class="mt-4 rounded-petal bg-red-50 p-3 text-red-800">
      {{ importError }}
    </p>
  </section>
</template>
