<script setup lang="ts">
import type { ContextQuestion } from '@/content/questionnaires/types';

interface Props {
  questions: ContextQuestion[];
  modelValue: Record<string, string>;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, string>];
}>();

function set(qKey: string, optKey: string): void {
  emit('update:modelValue', { ...props.modelValue, [qKey]: optKey });
}
</script>

<template>
  <div class="space-y-8">
    <fieldset v-for="q in props.questions" :key="q.key" class="card">
      <legend class="text-lg font-semibold">{{ q.label }}</legend>
      <div class="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <label
          v-for="opt in q.options"
          :key="opt.key"
          class="flex min-h-touch cursor-pointer items-center gap-3 rounded-petal border-2 px-4 py-3 transition"
          :class="
            props.modelValue[q.key] === opt.key
              ? 'border-brand-600 bg-brand-50'
              : 'border-brand-200 hover:border-brand-400'
          "
        >
          <input
            type="radio"
            class="sr-only"
            :name="q.key"
            :value="opt.key"
            :checked="props.modelValue[q.key] === opt.key"
            @change="set(q.key, opt.key)"
          />
          <span v-if="opt.emoji" aria-hidden="true" class="text-2xl">{{ opt.emoji }}</span>
          <span>{{ opt.label }}</span>
        </label>
      </div>
    </fieldset>
  </div>
</template>
