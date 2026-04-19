<script setup lang="ts">
import { useHead } from '@vueuse/head';
import { computed } from 'vue';

interface Props {
  data: Record<string, unknown>;
}
const props = defineProps<Props>();

const serialized = computed(() => JSON.stringify(props.data));

useHead({
  script: [
    {
      type: 'application/ld+json',
      children: serialized,
    },
  ],
});
</script>

<template>
  <span hidden aria-hidden="true" />
</template>
