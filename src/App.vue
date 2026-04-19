<script setup lang="ts">
import AppHeader from '@/components/ui/AppHeader.vue';
import AppFooter from '@/components/ui/AppFooter.vue';
import InstallPrompt from '@/components/ui/InstallPrompt.vue';
</script>

<template>
  <a class="skip-link" href="#main">Aller au contenu</a>
  <div class="flex min-h-[100dvh] flex-col">
    <AppHeader />
    <main id="main" class="flex-1">
      <RouterView v-slot="{ Component }">
        <Transition name="fade" mode="out-in">
          <component :is="Component" />
        </Transition>
      </RouterView>
    </main>
    <AppFooter />
    <InstallPrompt />
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 180ms ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
