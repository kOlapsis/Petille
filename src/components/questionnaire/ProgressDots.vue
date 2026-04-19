<script setup lang="ts">
const props = defineProps<{ current: number; total: number }>();
</script>

<template>
  <ol
    class="flex items-center gap-2"
    :aria-label="`Étape ${props.current + 1} sur ${props.total}`"
  >
    <li
      v-for="i in props.total"
      :key="i"
      class="h-2.5 w-2.5 rounded-full transition"
      :class="i - 1 <= props.current ? 'bg-brand-600' : 'bg-brand-100'"
      :aria-current="i - 1 === props.current ? 'step' : undefined"
    />
  </ol>
</template>
