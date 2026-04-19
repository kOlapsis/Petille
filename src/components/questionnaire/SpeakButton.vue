<script setup lang="ts">
import { useSpeech } from '@/composables/useSpeech';

const props = defineProps<{ text: string }>();
const { supported, speaking, speak, cancel } = useSpeech();

function toggle(): void {
  if (speaking.value) cancel();
  else speak(props.text);
}
</script>

<template>
  <button
    v-if="supported"
    type="button"
    class="btn-ghost"
    :aria-pressed="speaking"
    :aria-label="speaking ? 'Arrêter la lecture' : 'Lire à voix haute'"
    @click="toggle"
  >
    <span aria-hidden="true">{{ speaking ? '⏸️' : '🔊' }}</span>
    <span class="text-sm">{{ speaking ? 'Stop' : 'Lire' }}</span>
  </button>
</template>
