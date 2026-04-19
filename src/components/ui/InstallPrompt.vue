<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const deferred = ref<BeforeInstallPromptEvent | null>(null);
const dismissed = ref(false);

const STORAGE_KEY = 'petille:install-dismissed';

function onBeforeInstall(e: Event): void {
  e.preventDefault();
  deferred.value = e as BeforeInstallPromptEvent;
}

function onInstalled(): void {
  deferred.value = null;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, '1');
  }
}

async function install(): Promise<void> {
  const ev = deferred.value;
  if (!ev) return;
  await ev.prompt();
  await ev.userChoice;
  deferred.value = null;
}

function dismiss(): void {
  dismissed.value = true;
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, '1');
  }
}

onMounted(() => {
  if (typeof window === 'undefined') return;
  if (localStorage.getItem(STORAGE_KEY) === '1') {
    dismissed.value = true;
    return;
  }
  window.addEventListener('beforeinstallprompt', onBeforeInstall);
  window.addEventListener('appinstalled', onInstalled);
});

onUnmounted(() => {
  if (typeof window === 'undefined') return;
  window.removeEventListener('beforeinstallprompt', onBeforeInstall);
  window.removeEventListener('appinstalled', onInstalled);
});
</script>

<template>
  <div
    v-if="deferred && !dismissed"
    class="fixed inset-x-3 bottom-3 z-40 rounded-petal border border-brand-200 bg-white p-4 shadow-soft md:left-auto md:right-4 md:max-w-sm"
    role="dialog"
    aria-labelledby="install-title"
  >
    <p id="install-title" class="font-semibold text-brand-800">
      Installer Pétille sur cet appareil ?
    </p>
    <p class="mt-1 text-sm text-ink-700">
      Une icône apparaîtra sur l'écran d'accueil. L'app fonctionne hors-ligne et sans compte.
    </p>
    <div class="mt-3 flex gap-2">
      <button type="button" class="btn-primary" @click="install">Installer</button>
      <button type="button" class="btn-ghost" @click="dismiss">Plus tard</button>
    </div>
  </div>
</template>
