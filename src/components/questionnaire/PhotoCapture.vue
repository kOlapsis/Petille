<script setup lang="ts">
import { ref } from 'vue';

interface Props {
  modelValue: string | null;
}
const props = defineProps<Props>();
const emit = defineEmits<{
  'update:modelValue': [value: string | null];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const error = ref<string | null>(null);

const MAX_BYTES = 1.5 * 1024 * 1024; // 1.5 MB après réduction

async function onChange(event: Event): Promise<void> {
  error.value = null;
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  try {
    const dataUrl = await fileToResizedDataUrl(file, 1600, 0.85);
    if (dataUrl.length > MAX_BYTES * 1.4) {
      const compact = await fileToResizedDataUrl(file, 1100, 0.75);
      emit('update:modelValue', compact);
    } else {
      emit('update:modelValue', dataUrl);
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Erreur image.';
  }
}

function clear(): void {
  emit('update:modelValue', null);
  if (inputRef.value) inputRef.value.value = '';
}

async function fileToResizedDataUrl(
  file: File,
  maxSide: number,
  quality: number
): Promise<string> {
  const bitmap = await createImageBitmap(file);
  const ratio = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const w = Math.round(bitmap.width * ratio);
  const h = Math.round(bitmap.height * ratio);
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas non disponible.');
  ctx.drawImage(bitmap, 0, 0, w, h);
  return canvas.toDataURL('image/webp', quality);
}
</script>

<template>
  <div class="space-y-3">
    <div v-if="props.modelValue" class="flex flex-col items-start gap-2">
      <img
        :src="props.modelValue"
        alt="Photo du dessin"
        class="max-h-64 rounded-petal border border-brand-200"
      />
      <button type="button" class="btn-ghost" @click="clear">Retirer la photo</button>
    </div>
    <div v-else>
      <label class="btn-secondary cursor-pointer">
        📷 Prendre / choisir la photo
        <input
          ref="inputRef"
          type="file"
          accept="image/*"
          capture="environment"
          class="sr-only"
          @change="onChange"
        />
      </label>
    </div>
    <p v-if="error" class="text-sm text-red-700" role="alert">{{ error }}</p>
  </div>
</template>
