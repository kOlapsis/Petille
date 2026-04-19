<script setup lang="ts">
/**
 * Échelle 0-3 pour 9-11 ans, par section.
 */
import { ref, watch } from 'vue';
import type { RatingSection } from '@/content/questionnaires/types';

interface Props {
  sections: RatingSection[];
  scaleLabels: string[];
  modelValue: Record<string, number>;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: Record<string, number>];
}>();

const local = ref<Record<string, number>>({ ...props.modelValue });
watch(
  () => props.modelValue,
  (v) => {
    local.value = { ...v };
  },
  { deep: true }
);

function set(key: string, score: number): void {
  local.value = { ...local.value, [key]: score };
  emit('update:modelValue', local.value);
}
</script>

<template>
  <div class="space-y-8">
    <section v-for="section in props.sections" :key="section.key" class="card">
      <h3 class="flex items-center gap-2 text-xl font-semibold">
        <span aria-hidden="true">{{ section.emoji }}</span> {{ section.title }}
      </h3>
      <ul class="mt-4 divide-y divide-brand-100">
        <li v-for="item in section.items" :key="item.key" class="py-3">
          <fieldset>
            <legend class="flex items-center gap-2 text-base">
              <span aria-hidden="true">{{ item.emoji }}</span>
              <span>{{ item.label }}</span>
            </legend>
            <div class="mt-2 flex flex-wrap gap-2">
              <label
                v-for="(label, idx) in props.scaleLabels"
                :key="idx"
                class="inline-flex min-h-touch min-w-touch cursor-pointer items-center justify-center gap-2 rounded-petal border-2 px-3 py-2 text-sm font-semibold transition"
                :class="
                  (props.modelValue[item.key] ?? -1) === idx
                    ? 'border-brand-600 bg-brand-600 text-white'
                    : 'border-brand-200 hover:border-brand-400'
                "
              >
                <input
                  type="radio"
                  class="sr-only"
                  :name="item.key"
                  :value="idx"
                  :checked="(props.modelValue[item.key] ?? -1) === idx"
                  @change="set(item.key, idx)"
                />
                <span aria-hidden="true">{{ idx }}</span>
                <span class="hidden sm:inline">{{ label }}</span>
              </label>
            </div>
          </fieldset>
        </li>
      </ul>
    </section>
  </div>
</template>
