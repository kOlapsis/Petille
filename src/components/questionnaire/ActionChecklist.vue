<script setup lang="ts">
import type { ActionGroup } from '@/content/questionnaires/types';

interface Props {
  groups: ActionGroup[];
  modelValue: string[];
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string[]];
}>();

function toggle(key: string): void {
  const set = new Set(props.modelValue);
  if (set.has(key)) set.delete(key);
  else set.add(key);
  emit('update:modelValue', Array.from(set));
}
</script>

<template>
  <div class="space-y-6">
    <section v-for="group in props.groups" :key="group.key">
      <h3 v-if="group.title && props.groups.length > 1" class="mb-3 text-lg font-semibold">
        {{ group.title }}
      </h3>
      <ul class="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <li v-for="item in group.items" :key="item.key">
          <label
            class="flex min-h-touch cursor-pointer items-start gap-3 rounded-petal border-2 px-4 py-3 transition"
            :class="
              props.modelValue.includes(item.key)
                ? 'border-brand-600 bg-brand-50'
                : 'border-brand-200 hover:border-brand-400'
            "
          >
            <input
              type="checkbox"
              class="mt-1 h-5 w-5 accent-brand-600"
              :checked="props.modelValue.includes(item.key)"
              @change="toggle(item.key)"
            />
            <span>{{ item.label }}</span>
          </label>
        </li>
      </ul>
    </section>
  </div>
</template>
