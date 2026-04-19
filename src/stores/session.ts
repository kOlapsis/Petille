/**
 * Store de la session questionnaire en cours (work-in-progress).
 * Sépare l'état d'orchestration (étape courante, timer) de la donnée stockée
 * dans `family.children[x].sessions[]`.
 */
import { defineStore } from 'pinia';
import type { Session } from '@/lib/schema';
import { summarize } from '@/lib/profile';

interface SessionState {
  childId: string | null;
  session: Session | null;
  step: number;
  startedAt: number | null; // performance.now()-ish ms epoch
}

export const useSessionStore = defineStore('session', {
  state: (): SessionState => ({
    childId: null,
    session: null,
    step: 0,
    startedAt: null,
  }),

  getters: {
    isActive: (s) => s.session !== null,
  },

  actions: {
    begin(childId: string, session: Session): void {
      this.childId = childId;
      this.session = session;
      this.step = 0;
      this.startedAt = Date.now();
    },

    next(): void {
      this.step += 1;
    },

    prev(): void {
      if (this.step > 0) this.step -= 1;
    },

    finish(): Session | null {
      if (!this.session) return null;
      if (this.startedAt) {
        this.session.duration_seconds = Math.round((Date.now() - this.startedAt) / 1000);
      }
      this.session.profile_summary = summarize(this.session.answers);
      const finished = this.session;
      this.reset();
      return finished;
    },

    reset(): void {
      this.childId = null;
      this.session = null;
      this.step = 0;
      this.startedAt = null;
    },
  },
});
