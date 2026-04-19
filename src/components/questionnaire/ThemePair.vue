<script setup lang="ts">
/**
 * Une paire de thèmes (6-8 ans). L'enfant choisit gauche / droite / les deux / ni l'un ni l'autre.
 *
 * Encoding du score dans `themes` :
 *   - 0 = non choisi
 *   - 1 = choisi seul
 *   - 2 = choisi en mode « les deux »
 */
import type { ThemePair } from '@/content/questionnaires/types';

interface Props {
  pair: ThemePair;
  /** Map keyTheme → score 0|1|2 */
  modelValue: Record<string, number>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, number>];
}>();

type Choice = 'left' | 'right' | 'both' | 'neither' | null;

function currentChoice(): Choice {
  const l = props.modelValue[props.pair.left.key] ?? 0;
  const r = props.modelValue[props.pair.right.key] ?? 0;
  if (l === 2 && r === 2) return 'both';
  if (l === 1 && r === 0) return 'left';
  if (l === 0 && r === 1) return 'right';
  if (l === 0 && r === 0) return 'neither';
  return null;
}

function pick(choice: Choice): void {
  const next: Record<string, number> = { ...props.modelValue };
  switch (choice) {
    case 'left':
      next[props.pair.left.key] = 1;
      next[props.pair.right.key] = 0;
      break;
    case 'right':
      next[props.pair.left.key] = 0;
      next[props.pair.right.key] = 1;
      break;
    case 'both':
      next[props.pair.left.key] = 2;
      next[props.pair.right.key] = 2;
      break;
    case 'neither':
      next[props.pair.left.key] = 0;
      next[props.pair.right.key] = 0;
      break;
    case null:
      delete next[props.pair.left.key];
      delete next[props.pair.right.key];
  }
  emit('update:modelValue', next);
}
</script>

<template>
  <fieldset class="space-y-4">
    <legend class="sr-only">Paire {{ props.pair.pairId }}</legend>
    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <button
        type="button"
        class="card flex flex-col items-center gap-3 text-center transition"
        :class="
          currentChoice() === 'left' || currentChoice() === 'both'
            ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600'
            : 'hover:border-brand-300'
        "
        :aria-pressed="currentChoice() === 'left' || currentChoice() === 'both'"
        @click="pick(currentChoice() === 'left' ? null : 'left')"
      >
        <span class="text-5xl" aria-hidden="true">{{ props.pair.left.emoji }}</span>
        <span class="text-lg font-semibold">{{ props.pair.left.label }}</span>
      </button>
      <button
        type="button"
        class="card flex flex-col items-center gap-3 text-center transition"
        :class="
          currentChoice() === 'right' || currentChoice() === 'both'
            ? 'border-brand-600 bg-brand-50 ring-2 ring-brand-600'
            : 'hover:border-brand-300'
        "
        :aria-pressed="currentChoice() === 'right' || currentChoice() === 'both'"
        @click="pick(currentChoice() === 'right' ? null : 'right')"
      >
        <span class="text-5xl" aria-hidden="true">{{ props.pair.right.emoji }}</span>
        <span class="text-lg font-semibold">{{ props.pair.right.label }}</span>
      </button>
    </div>
    <div class="flex flex-wrap justify-center gap-2">
      <button
        type="button"
        class="btn-secondary"
        :aria-pressed="currentChoice() === 'both'"
        @click="pick(currentChoice() === 'both' ? null : 'both')"
      >
        💛 Les deux
      </button>
      <button
        type="button"
        class="btn-ghost"
        :aria-pressed="currentChoice() === 'neither'"
        @click="pick(currentChoice() === 'neither' ? null : 'neither')"
      >
        Ni l'un ni l'autre
      </button>
    </div>
  </fieldset>
</template>
