<script setup lang="ts">
import { computed } from 'vue';
import type { Session } from '@/lib/schema';
import { actionLabel, contextOptionLabel, magicDayFieldLabel, themeLabel } from '@/lib/labels';

interface Props {
  session: Session;
  childFirstName: string;
}
const props = defineProps<Props>();

const themes = computed(() =>
  props.session.profile_summary.top_themes.map((k) =>
    themeLabel(props.session.questionnaire_version, k)
  )
);
const actions = computed(() =>
  props.session.profile_summary.top_actions.map((k) =>
    actionLabel(props.session.questionnaire_version, k)
  )
);
const contextEntries = computed(() =>
  Object.entries(props.session.answers.context).map(([qKey, optKey]) => ({
    qKey,
    ...contextOptionLabel(props.session.questionnaire_version, qKey, optKey),
  }))
);

const magicExtras = computed(() => {
  const extras = props.session.answers.magic_day.extras ?? {};
  return Object.entries(extras)
    .filter(([, value]) => value && value.trim().length > 0)
    .map(([key, value]) => ({
      key,
      label: magicDayFieldLabel(props.session.questionnaire_version, key).label,
      value,
    }));
});

const hasMagicContent = computed(
  () =>
    !!props.session.answers.magic_day.text ||
    !!props.session.answers.magic_day.photo_data_url ||
    magicExtras.value.length > 0
);
</script>

<template>
  <article class="space-y-8">
    <header>
      <h1 class="text-2xl font-bold text-brand-700">
        Ce qui fait pétiller {{ props.childFirstName }} aujourd'hui
      </h1>
      <p class="mt-1 text-sm text-ink-700">
        Pas de métier, pas de conclusion. Juste un portrait à un instant T.
      </p>
    </header>

    <section v-if="themes.length" aria-labelledby="themes-h">
      <h3 id="themes-h" class="text-lg font-semibold">Tes univers du moment</h3>
      <ul class="mt-3 flex flex-wrap gap-2">
        <li
          v-for="t in themes"
          :key="t.label"
          class="inline-flex items-center gap-2 rounded-petal bg-brand-100 px-3 py-2 text-brand-800"
        >
          <span v-if="t.emoji" aria-hidden="true">{{ t.emoji }}</span>
          <span>{{ t.label }}</span>
        </li>
      </ul>
    </section>

    <section v-if="actions.length" aria-labelledby="actions-h">
      <h3 id="actions-h" class="text-lg font-semibold">Tes façons de faire</h3>
      <ul class="mt-3 list-inside list-disc space-y-1 text-ink-700">
        <li v-for="a in actions" :key="a.label">{{ a.label }}</li>
      </ul>
    </section>

    <section v-if="contextEntries.length" aria-labelledby="context-h">
      <h3 id="context-h" class="text-lg font-semibold">Tu es bien quand…</h3>
      <ul class="mt-3 flex flex-wrap gap-2">
        <li
          v-for="entry in contextEntries"
          :key="entry.qKey"
          class="inline-flex items-center gap-2 rounded-petal border border-brand-200 px-3 py-2 text-sm"
        >
          <span v-if="entry.emoji" aria-hidden="true">{{ entry.emoji }}</span>
          <span>{{ entry.label }}</span>
        </li>
      </ul>
    </section>

    <section v-if="hasMagicContent" aria-labelledby="magic-h">
      <h3 id="magic-h" class="text-lg font-semibold">Tes mots à toi</h3>
      <p v-if="props.session.answers.magic_day.text" class="mt-2 whitespace-pre-line text-ink-700">
        {{ props.session.answers.magic_day.text }}
      </p>
      <dl v-if="magicExtras.length" class="mt-3 space-y-3">
        <div v-for="entry in magicExtras" :key="entry.key">
          <dt class="text-sm font-semibold text-brand-700">{{ entry.label }}</dt>
          <dd class="mt-1 whitespace-pre-line text-ink-700">{{ entry.value }}</dd>
        </div>
      </dl>
      <img
        v-if="props.session.answers.magic_day.photo_data_url"
        :src="props.session.answers.magic_day.photo_data_url"
        alt="Dessin de la journée magique"
        class="mt-3 max-h-72 rounded-petal border border-brand-200"
      />
    </section>
  </article>
</template>
