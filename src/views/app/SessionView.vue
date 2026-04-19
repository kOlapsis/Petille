<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFamilyStore } from '@/stores/family';
import { useSessionStore } from '@/stores/session';
import { resolveQuestionnaire } from '@/content/questionnaires';
import { ageFromBirthYear } from '@/lib/schema';
import ProgressDots from '@/components/questionnaire/ProgressDots.vue';
import StepNav from '@/components/questionnaire/StepNav.vue';
import SpeakButton from '@/components/questionnaire/SpeakButton.vue';
import ThemePair from '@/components/questionnaire/ThemePair.vue';
import ThemeRating from '@/components/questionnaire/ThemeRating.vue';
import ActionChecklist from '@/components/questionnaire/ActionChecklist.vue';
import ContextPicker from '@/components/questionnaire/ContextPicker.vue';
import MagicDay from '@/components/questionnaire/MagicDay.vue';

const route = useRoute();
const router = useRouter();
const family = useFamilyStore();
const sessionStore = useSessionStore();

const initializing = ref(true);

const childId = computed(() => String(route.params.childId));
const child = computed(() => family.childById(childId.value));

const questionnaire = computed(() => {
  if (!sessionStore.session) return null;
  return resolveQuestionnaire(sessionStore.session.questionnaire_version);
});

const currentStep = computed(() => {
  if (!questionnaire.value) return null;
  return questionnaire.value.steps[sessionStore.step] ?? null;
});

const stepIndex = computed(() => sessionStore.step);
const totalSteps = computed(() => questionnaire.value?.steps.length ?? 0);
const isLast = computed(() => stepIndex.value === totalSteps.value - 1);

// Pour la pair-step (6-8), on découpe en sous-étapes (une paire = un écran).
const pairCursor = ref(0);

onMounted(async () => {
  await family.hydrate();
  if (!child.value) {
    void router.replace('/app');
    return;
  }
  if (!sessionStore.isActive || sessionStore.childId !== childId.value) {
    const age = ageFromBirthYear(child.value.birth_year);
    const fresh = family.startSession(childId.value, age);
    sessionStore.begin(childId.value, fresh);
    pairCursor.value = 0;
  }
  initializing.value = false;
});

function readableTextOf(): string {
  const step = currentStep.value;
  if (!step) return '';
  if (step.kind === 'themes-pair') {
    const pair = step.pairs[pairCursor.value];
    if (!pair) return '';
    return `${step.title}. ${pair.left.label}, ou ${pair.right.label}. Tu peux choisir les deux.`;
  }
  if (step.kind === 'themes-rating') {
    return `${step.title}. ${step.intro ?? ''}`;
  }
  if (step.kind === 'actions') {
    return `${step.title}. ${step.intro ?? ''}`;
  }
  if (step.kind === 'context') {
    return `${step.title}. ${step.intro ?? ''}`;
  }
  if (step.kind === 'magic-day') {
    return `${step.title}. ${step.intro ?? ''}`;
  }
  return '';
}

function next(): void {
  const step = currentStep.value;
  if (!step) return;
  // Si étape paires, on avance d'abord paire par paire.
  if (step.kind === 'themes-pair' && pairCursor.value < step.pairs.length - 1) {
    pairCursor.value += 1;
    return;
  }
  if (sessionStore.step < totalSteps.value - 1) {
    sessionStore.next();
    pairCursor.value = 0;
    family.touch();
    return;
  }
  // Fin du questionnaire.
  finalizeAndShowSummary();
}

function prev(): void {
  const step = currentStep.value;
  if (step?.kind === 'themes-pair' && pairCursor.value > 0) {
    pairCursor.value -= 1;
    return;
  }
  if (sessionStore.step > 0) {
    sessionStore.prev();
    const back = questionnaire.value?.steps[sessionStore.step];
    if (back?.kind === 'themes-pair') {
      pairCursor.value = back.pairs.length - 1;
    } else {
      pairCursor.value = 0;
    }
  } else {
    void router.push('/app/tableau');
  }
}

function skip(): void {
  next();
}

function finalizeAndShowSummary(): void {
  const finished = sessionStore.finish();
  if (!finished) return;
  family.touch();
  void family.flush().then(() => {
    void router.replace(`/app/enfant/${childId.value}/session/${finished.id}/synthese`);
  });
}

// --- Bindings v-model des composants par étape ---
function setThemes(value: Record<string, number>): void {
  if (!sessionStore.session) return;
  sessionStore.session.answers.themes = value;
  family.touch();
}
function setActions(value: string[]): void {
  if (!sessionStore.session) return;
  sessionStore.session.answers.actions = value;
  family.touch();
}
function setContext(value: Record<string, string>): void {
  if (!sessionStore.session) return;
  sessionStore.session.answers.context = value;
  family.touch();
}
function setMagic(value: typeof sessionStore.session.answers.magic_day): void {
  if (!sessionStore.session) return;
  sessionStore.session.answers.magic_day = value;
  family.touch();
}
</script>

<template>
  <section v-if="initializing" class="mx-auto max-w-2xl px-4 py-12">
    <p>Préparation…</p>
  </section>

  <section v-else-if="currentStep && sessionStore.session" class="mx-auto max-w-3xl px-4 py-8">
    <header class="mb-6 flex flex-wrap items-center justify-between gap-4">
      <div>
        <p class="text-sm uppercase tracking-wide text-ink-700">
          {{ child?.first_name }} · {{ sessionStore.session.questionnaire_version }}
        </p>
        <h1 class="text-2xl font-bold md:text-3xl">{{ currentStep.title }}</h1>
        <p v-if="currentStep.intro" class="mt-1 text-ink-700">{{ currentStep.intro }}</p>
      </div>
      <div class="flex items-center gap-3">
        <SpeakButton :text="readableTextOf()" />
        <ProgressDots :current="stepIndex" :total="totalSteps" />
      </div>
    </header>

    <!-- Étape Thèmes paires (6-8) — une paire à la fois -->
    <template v-if="currentStep.kind === 'themes-pair'">
      <p class="mb-3 text-sm text-ink-700">
        Question {{ pairCursor + 1 }} sur {{ currentStep.pairs.length }}
      </p>
      <ThemePair
        :pair="currentStep.pairs[pairCursor]!"
        :model-value="sessionStore.session.answers.themes"
        @update:model-value="setThemes"
      />
    </template>

    <!-- Étape Thèmes ratings (9-11) -->
    <template v-else-if="currentStep.kind === 'themes-rating'">
      <ThemeRating
        :sections="currentStep.sections"
        :scale-labels="currentStep.scale.labels"
        :model-value="sessionStore.session.answers.themes"
        @update:model-value="setThemes"
      />
    </template>

    <template v-else-if="currentStep.kind === 'actions'">
      <ActionChecklist
        :groups="currentStep.groups"
        :model-value="sessionStore.session.answers.actions"
        @update:model-value="setActions"
      />
    </template>

    <template v-else-if="currentStep.kind === 'context'">
      <ContextPicker
        :questions="currentStep.questions"
        :model-value="sessionStore.session.answers.context"
        @update:model-value="setContext"
      />
    </template>

    <template v-else-if="currentStep.kind === 'magic-day'">
      <MagicDay
        :fields="currentStep.fields"
        :allow-photo="currentStep.allowPhoto"
        :model-value="sessionStore.session.answers.magic_day"
        @update:model-value="setMagic"
      />
      <p
        v-if="currentStep.closingNote"
        class="mt-4 rounded-petal bg-cream-100 p-3 text-sm italic text-ink-700"
      >
        {{ currentStep.closingNote }}
      </p>
    </template>

    <StepNav
      :can-go-back="stepIndex > 0 || (currentStep.kind === 'themes-pair' && pairCursor > 0)"
      :is-last="isLast && (currentStep.kind !== 'themes-pair' || pairCursor === currentStep.pairs.length - 1)"
      @prev="prev"
      @skip="skip"
      @next="next"
    />
  </section>
</template>
