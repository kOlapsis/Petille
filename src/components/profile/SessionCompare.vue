<script setup lang="ts">
import { computed } from 'vue';
import type { Session } from '@/lib/schema';
import { actionLabel, contextOptionLabel, themeLabel } from '@/lib/labels';

interface Props {
  childFirstName: string;
  earlier: Session;
  later: Session;
}
const props = defineProps<Props>();

interface ThemeDiff {
  stable: string[];
  appeared: string[];
  disappeared: string[];
}

const themeDiff = computed<ThemeDiff>(() => {
  const a = new Set(props.earlier.profile_summary.top_themes);
  const b = new Set(props.later.profile_summary.top_themes);
  return {
    stable: [...a].filter((k) => b.has(k)),
    appeared: [...b].filter((k) => !a.has(k)),
    disappeared: [...a].filter((k) => !b.has(k)),
  };
});

const actionDiff = computed(() => {
  const a = new Set(props.earlier.answers.actions);
  const b = new Set(props.later.answers.actions);
  return {
    stable: [...a].filter((k) => b.has(k)),
    appeared: [...b].filter((k) => !a.has(k)),
    disappeared: [...a].filter((k) => !b.has(k)),
  };
});

const contextRows = computed(() => {
  const keys = new Set([
    ...Object.keys(props.earlier.answers.context),
    ...Object.keys(props.later.answers.context),
  ]);
  return [...keys].map((qKey) => ({
    qKey,
    earlier: optionLabel(props.earlier, qKey),
    later: optionLabel(props.later, qKey),
  }));
});

function optionLabel(session: Session, qKey: string): string {
  const optKey = session.answers.context[qKey];
  if (!optKey) return '—';
  return contextOptionLabel(session.questionnaire_version, qKey, optKey).label;
}

function themeLabelOf(session: Session, key: string): string {
  return themeLabel(session.questionnaire_version, key).label;
}

function actionLabelOf(session: Session, key: string): string {
  return actionLabel(session.questionnaire_version, key).label;
}

const referenceSession = computed(() => props.later);
</script>

<template>
  <article class="space-y-10">
    <header>
      <h2 class="text-2xl font-bold text-brand-700">
        {{ props.childFirstName }} — d'un passage à l'autre
      </h2>
      <p class="mt-1 text-sm text-ink-700">
        Du {{ props.earlier.date.slice(0, 10) }} ({{ props.earlier.age_at_session }} ans)
        au {{ props.later.date.slice(0, 10) }} ({{ props.later.age_at_session }} ans).
      </p>
    </header>

    <section aria-labelledby="cmp-themes">
      <h3 id="cmp-themes" class="text-lg font-semibold">Univers</h3>
      <div class="mt-3 grid gap-4 sm:grid-cols-3">
        <div class="card">
          <p class="text-sm font-semibold text-brand-700">Ce qui reste</p>
          <ul v-if="themeDiff.stable.length" class="mt-2 space-y-1 text-sm">
            <li v-for="k in themeDiff.stable" :key="k">{{ themeLabelOf(referenceSession, k) }}</li>
          </ul>
          <p v-else class="mt-2 text-sm italic text-ink-700">Aucun thème commun aux deux passages.</p>
        </div>
        <div class="card">
          <p class="text-sm font-semibold text-brand-700">Ce qui apparaît</p>
          <ul v-if="themeDiff.appeared.length" class="mt-2 space-y-1 text-sm">
            <li v-for="k in themeDiff.appeared" :key="k">{{ themeLabelOf(props.later, k) }}</li>
          </ul>
          <p v-else class="mt-2 text-sm italic text-ink-700">Rien de nouveau dans le top.</p>
        </div>
        <div class="card">
          <p class="text-sm font-semibold text-brand-700">Ce qui s'éloigne</p>
          <ul v-if="themeDiff.disappeared.length" class="mt-2 space-y-1 text-sm">
            <li v-for="k in themeDiff.disappeared" :key="k">{{ themeLabelOf(props.earlier, k) }}</li>
          </ul>
          <p v-else class="mt-2 text-sm italic text-ink-700">Aucun thème n'a disparu.</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="cmp-actions">
      <h3 id="cmp-actions" class="text-lg font-semibold">Façons de faire</h3>
      <div class="mt-3 grid gap-4 sm:grid-cols-3">
        <div class="card">
          <p class="text-sm font-semibold text-brand-700">Toujours là</p>
          <ul v-if="actionDiff.stable.length" class="mt-2 space-y-1 text-sm">
            <li v-for="k in actionDiff.stable" :key="k">{{ actionLabelOf(referenceSession, k) }}</li>
          </ul>
          <p v-else class="mt-2 text-sm italic text-ink-700">—</p>
        </div>
        <div class="card">
          <p class="text-sm font-semibold text-brand-700">Nouvelles</p>
          <ul v-if="actionDiff.appeared.length" class="mt-2 space-y-1 text-sm">
            <li v-for="k in actionDiff.appeared" :key="k">{{ actionLabelOf(props.later, k) }}</li>
          </ul>
          <p v-else class="mt-2 text-sm italic text-ink-700">—</p>
        </div>
        <div class="card">
          <p class="text-sm font-semibold text-brand-700">Mises de côté</p>
          <ul v-if="actionDiff.disappeared.length" class="mt-2 space-y-1 text-sm">
            <li v-for="k in actionDiff.disappeared" :key="k">{{ actionLabelOf(props.earlier, k) }}</li>
          </ul>
          <p v-else class="mt-2 text-sm italic text-ink-700">—</p>
        </div>
      </div>
    </section>

    <section aria-labelledby="cmp-context">
      <h3 id="cmp-context" class="text-lg font-semibold">Contexte</h3>
      <div class="mt-3 overflow-x-auto">
        <table class="w-full border-collapse text-sm">
          <thead>
            <tr class="text-left">
              <th class="border-b border-brand-200 py-2 pr-4 font-semibold">Question</th>
              <th class="border-b border-brand-200 py-2 pr-4 font-semibold">
                {{ props.earlier.date.slice(0, 10) }}
              </th>
              <th class="border-b border-brand-200 py-2 pr-4 font-semibold">
                {{ props.later.date.slice(0, 10) }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in contextRows" :key="row.qKey">
              <td class="border-b border-brand-100 py-2 pr-4 text-ink-700">{{ row.qKey }}</td>
              <td class="border-b border-brand-100 py-2 pr-4">{{ row.earlier }}</td>
              <td class="border-b border-brand-100 py-2 pr-4">{{ row.later }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section aria-labelledby="cmp-magic" class="grid gap-6 md:grid-cols-2">
      <div>
        <h3 id="cmp-magic" class="text-lg font-semibold">Journée magique — avant</h3>
        <p
          v-if="props.earlier.answers.magic_day.text"
          class="mt-2 whitespace-pre-line text-sm text-ink-700"
        >
          {{ props.earlier.answers.magic_day.text }}
        </p>
        <img
          v-if="props.earlier.answers.magic_day.photo_data_url"
          :src="props.earlier.answers.magic_day.photo_data_url"
          alt="Dessin du passage précédent"
          class="mt-2 max-h-56 rounded-petal border border-brand-200"
        />
      </div>
      <div>
        <h3 class="text-lg font-semibold">Journée magique — maintenant</h3>
        <p
          v-if="props.later.answers.magic_day.text"
          class="mt-2 whitespace-pre-line text-sm text-ink-700"
        >
          {{ props.later.answers.magic_day.text }}
        </p>
        <img
          v-if="props.later.answers.magic_day.photo_data_url"
          :src="props.later.answers.magic_day.photo_data_url"
          alt="Dessin du dernier passage"
          class="mt-2 max-h-56 rounded-petal border border-brand-200"
        />
      </div>
    </section>

    <aside class="card border-brand-300 bg-cream-100">
      <p class="italic text-ink-700">
        Ce qui reste stable d'une année sur l'autre est souvent une piste solide.
        Ce qui change est tout aussi normal : on grandit, on essaie, on bifurque.
        Aucune lecture n'est obligatoire — ce tableau est un point de départ pour discuter, pas un verdict.
      </p>
    </aside>
  </article>
</template>
