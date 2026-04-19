/**
 * Wrapper minimaliste autour de Web Speech API (synthèse vocale).
 * Détecte l'absence de support pour ne pas casser l'UI.
 */
import { computed, onUnmounted, ref } from 'vue';

export function useSpeech(lang: string = 'fr-FR') {
  const supported = typeof window !== 'undefined' && 'speechSynthesis' in window;
  const speaking = ref(false);

  function speak(text: string): void {
    if (!supported || !text.trim()) return;
    cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = lang;
    utter.rate = 0.95;
    utter.pitch = 1;
    utter.onend = () => {
      speaking.value = false;
    };
    utter.onerror = () => {
      speaking.value = false;
    };
    speaking.value = true;
    window.speechSynthesis.speak(utter);
  }

  function cancel(): void {
    if (!supported) return;
    window.speechSynthesis.cancel();
    speaking.value = false;
  }

  onUnmounted(cancel);

  return {
    supported: computed(() => supported),
    speaking,
    speak,
    cancel,
  };
}
