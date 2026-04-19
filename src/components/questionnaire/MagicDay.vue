<script setup lang="ts">
import type { MagicDayField } from '@/content/questionnaires/types';
import type { MagicDayAnswers } from '@/lib/schema';
import PhotoCapture from './PhotoCapture.vue';

interface Props {
  fields: MagicDayField[];
  allowPhoto: boolean;
  modelValue: MagicDayAnswers;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: MagicDayAnswers];
}>();

function setField(key: string, value: string): void {
  if (key === 'main_text') {
    emit('update:modelValue', { ...props.modelValue, text: value });
    return;
  }
  emit('update:modelValue', {
    ...props.modelValue,
    extras: { ...(props.modelValue.extras ?? {}), [key]: value },
  });
}

function setPhoto(value: string | null): void {
  emit('update:modelValue', { ...props.modelValue, photo_data_url: value });
}

function valueOf(key: string): string {
  if (key === 'main_text') return props.modelValue.text;
  return props.modelValue.extras?.[key] ?? '';
}
</script>

<template>
  <div class="space-y-6">
    <div v-for="field in props.fields" :key="field.key" class="card">
      <label :for="`field-${field.key}`" class="block text-lg font-semibold">{{
        field.label
      }}</label>
      <textarea
        v-if="field.multiline"
        :id="`field-${field.key}`"
        :placeholder="field.placeholder"
        rows="3"
        class="mt-2 w-full rounded-petal border border-brand-200 p-3 focus:border-brand-600"
        :value="valueOf(field.key)"
        @input="setField(field.key, ($event.target as HTMLTextAreaElement).value)"
      />
      <input
        v-else
        :id="`field-${field.key}`"
        type="text"
        :placeholder="field.placeholder"
        class="mt-2 w-full rounded-petal border border-brand-200 px-3 py-2 focus:border-brand-600"
        :value="valueOf(field.key)"
        @input="setField(field.key, ($event.target as HTMLInputElement).value)"
      />
    </div>
    <div v-if="props.allowPhoto" class="card">
      <h3 class="text-lg font-semibold">Photo de ton dessin (facultatif)</h3>
      <p class="mt-1 text-sm text-ink-700">
        Si tu as fait un dessin, prends-le en photo pour le garder avec tes réponses.
      </p>
      <PhotoCapture
        class="mt-3"
        :model-value="props.modelValue.photo_data_url"
        @update:model-value="setPhoto"
      />
    </div>
  </div>
</template>
