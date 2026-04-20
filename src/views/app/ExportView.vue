<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useFamilyStore } from '@/stores/family';
import { downloadAsFile, exportFamily } from '@/lib/exporters/exportJson';
import { buildReminderIcs, icsFilename } from '@/lib/ics';
import { buildSessionPdf, pdfFilename } from '@/lib/pdf';
import type { Child, Session } from '@/lib/schema';

const family = useFamilyStore();

const passphrase = ref('');
const status = ref<{ kind: 'idle' | 'ok' | 'err'; message: string }>({ kind: 'idle', message: '' });
const busy = ref(false);

const selectedChildId = ref<string>('');
const selectedSessionId = ref<string>('');

onMounted(async () => {
  await family.hydrate();
  if (family.children.length && !selectedChildId.value) {
    selectedChildId.value = family.children[0]!.id;
    syncSession();
  }
});

const selectedChild = computed<Child | null>(() => family.childById(selectedChildId.value));
const completedSessions = computed<Session[]>(
  () => selectedChild.value?.sessions.filter((s) => s.completed_at !== null) ?? []
);
const selectedSession = computed<Session | null>(
  () => completedSessions.value.find((s) => s.id === selectedSessionId.value) ?? null
);

function syncSession(): void {
  const sessions = completedSessions.value;
  selectedSessionId.value = sessions[sessions.length - 1]?.id ?? '';
}

function setStatus(kind: 'ok' | 'err', message: string): void {
  status.value = { kind, message };
}

async function downloadJson(): Promise<void> {
  if (!family.family) return;
  busy.value = true;
  status.value = { kind: 'idle', message: '' };
  try {
    await family.flush();
    const result = await exportFamily(family.family, {
      passphrase: passphrase.value.trim() || undefined,
    });
    downloadAsFile(result);
    setStatus('ok', `Carnet exporté : ${result.filename}`);
  } catch (e) {
    setStatus('err', `Échec export JSON : ${(e as Error).message}`);
  } finally {
    busy.value = false;
  }
}

async function downloadPdf(): Promise<void> {
  const child = selectedChild.value;
  const session = selectedSession.value;
  if (!child || !session) {
    setStatus('err', 'Choisis un enfant et un passage avant de générer le PDF.');
    return;
  }
  busy.value = true;
  try {
    const blob = await buildSessionPdf(child, session);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfFilename(child, session);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setStatus('ok', 'PDF téléchargé.');
  } catch (e) {
    setStatus('err', `Échec PDF : ${(e as Error).message}`);
  } finally {
    busy.value = false;
  }
}

function downloadIcs(): void {
  const child = selectedChild.value;
  if (!child) {
    setStatus('err', 'Choisis un enfant pour le rappel annuel.');
    return;
  }
  try {
    const ics = buildReminderIcs(child);
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = icsFilename(child);
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 0);
    setStatus('ok', 'Rappel ajouté à votre calendrier.');
  } catch (e) {
    setStatus('err', `Échec .ics : ${(e as Error).message}`);
  }
}
</script>

<template>
  <section class="mx-auto max-w-3xl px-4 py-12">
    <header class="mb-8">
      <h1 class="text-3xl font-bold">Sauvegarder mon carnet</h1>
      <p class="mt-2 text-ink-700">
        Tout reste sur votre appareil. Ces exports vous appartiennent — gardez-les où bon vous semble.
      </p>
    </header>

    <p
      v-if="status.kind !== 'idle'"
      :class="[
        'mb-6 rounded-petal px-4 py-3 text-sm',
        status.kind === 'ok' ? 'bg-brand-100 text-brand-800' : 'bg-red-100 text-red-800',
      ]"
      role="status"
    >
      {{ status.message }}
    </p>

    <article class="card mb-6">
      <h2 class="text-xl font-semibold">Sauvegarde JSON</h2>
      <p class="mt-1 text-sm text-ink-700">
        Toutes les données du carnet, dans un seul fichier réimportable plus tard.
      </p>
      <label class="mt-4 block text-sm font-medium" for="exp-pass">
        Phrase secrète (facultatif, mais recommandé)
      </label>
      <input
        id="exp-pass"
        v-model="passphrase"
        type="password"
        autocomplete="new-password"
        placeholder="Ex. : un mot de passe que vous retrouverez"
        class="mt-2 w-full rounded-petal border border-brand-200 px-3 py-2 focus:border-brand-600"
      />
      <p class="mt-2 text-xs text-ink-700">
        Si vous indiquez une phrase, le fichier est chiffré (AES-GCM 256). Sans elle, c'est du texte
        clair lisible par tout le monde.
      </p>
      <button
        type="button"
        class="btn-primary mt-4"
        :disabled="busy || !family.family"
        @click="downloadJson"
      >
        Télécharger le carnet
      </button>
    </article>

    <article class="card mb-6">
      <h2 class="text-xl font-semibold">PDF souvenir</h2>
      <p class="mt-1 text-sm text-ink-700">
        Une page de garde et la synthèse du passage choisi, à imprimer ou archiver.
      </p>
      <div class="mt-4 grid gap-3 sm:grid-cols-2">
        <label class="block text-sm">
          <span class="font-medium">Enfant</span>
          <select
            v-model="selectedChildId"
            class="mt-1 w-full rounded-petal border border-brand-200 px-3 py-2"
            @change="syncSession"
          >
            <option v-for="c in family.children" :key="c.id" :value="c.id">
              {{ c.first_name }}
            </option>
          </select>
        </label>
        <label class="block text-sm">
          <span class="font-medium">Passage</span>
          <select
            v-model="selectedSessionId"
            class="mt-1 w-full rounded-petal border border-brand-200 px-3 py-2"
          >
            <option v-for="s in completedSessions" :key="s.id" :value="s.id">
              {{ s.date.slice(0, 10) }} — {{ s.age_at_session }} ans
            </option>
          </select>
        </label>
      </div>
      <button
        type="button"
        class="btn-primary mt-4"
        :disabled="busy || !selectedSession"
        @click="downloadPdf"
      >
        Générer le PDF
      </button>
    </article>

    <article class="card">
      <h2 class="text-xl font-semibold">Rappel dans un an</h2>
      <p class="mt-1 text-sm text-ink-700">
        Un événement de calendrier (.ics) qui revient chaque année — parce qu'un an, ça passe vite.
      </p>
      <button
        type="button"
        class="btn-secondary mt-4"
        :disabled="busy || !selectedChild"
        @click="downloadIcs"
      >
        Ajouter à mon calendrier
      </button>
    </article>
  </section>
</template>
