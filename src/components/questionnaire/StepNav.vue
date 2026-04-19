<script setup lang="ts">
const props = defineProps<{
  canGoBack: boolean;
  isLast: boolean;
  showSkip?: boolean;
}>();

const emit = defineEmits<{
  prev: [];
  skip: [];
  next: [];
}>();
</script>

<template>
  <nav class="mt-8 flex flex-wrap items-center justify-between gap-3" aria-label="Navigation étape">
    <button
      type="button"
      class="btn-ghost"
      :disabled="!props.canGoBack"
      @click="emit('prev')"
    >
      ← Retour
    </button>
    <div class="flex flex-wrap gap-2">
      <button
        v-if="props.showSkip ?? true"
        type="button"
        class="btn-ghost"
        @click="emit('skip')"
      >
        Je passe
      </button>
      <button type="button" class="btn-primary" @click="emit('next')">
        {{ props.isLast ? 'Voir ma synthèse' : 'Suivant →' }}
      </button>
    </div>
  </nav>
</template>
