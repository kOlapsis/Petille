/**
 * Store du carnet famille actif. Hydrate depuis IndexedDB au premier accès,
 * autosauvegarde debouncée à chaque mutation.
 */
import { defineStore } from 'pinia';
import { v4 as uuid } from 'uuid';
import {
  emptyAnswers,
  emptyProfile,
  questionnaireVersionFor,
  SCHEMA_VERSION,
  type Child,
  type Family,
  type Session,
} from '@/lib/schema';
import { clearFamily, loadFamily, saveFamily } from '@/lib/db';

interface FamilyState {
  family: Family | null;
  hydrated: boolean;
  saveTimer: ReturnType<typeof setTimeout> | null;
}

const AUTOSAVE_MS = 800;

function nowIso(): string {
  return new Date().toISOString();
}

export const useFamilyStore = defineStore('family', {
  state: (): FamilyState => ({
    family: null,
    hydrated: false,
    saveTimer: null,
  }),

  getters: {
    children: (s) => s.family?.children ?? [],
    childById: (s) => (id: string) => s.family?.children.find((c) => c.id === id) ?? null,
  },

  actions: {
    async hydrate(): Promise<void> {
      if (this.hydrated) return;
      this.family = await loadFamily();
      this.hydrated = true;
    },

    createFamily(): Family {
      const family: Family = {
        schema_version: SCHEMA_VERSION,
        family_id: uuid(),
        created_at: nowIso(),
        last_updated: nowIso(),
        children: [],
      };
      this.family = family;
      this.scheduleSave();
      return family;
    },

    replaceFamily(family: Family): void {
      this.family = family;
      this.scheduleSave();
    },

    async destroyFamily(): Promise<void> {
      this.family = null;
      await clearFamily();
    },

    addChild(firstName: string, birthYear: number): Child {
      if (!this.family) this.createFamily();
      const child: Child = {
        id: uuid(),
        first_name: firstName.trim(),
        birth_year: birthYear,
        sessions: [],
      };
      this.family!.children.push(child);
      this.touch();
      return child;
    },

    removeChild(childId: string): void {
      if (!this.family) return;
      this.family.children = this.family.children.filter((c) => c.id !== childId);
      this.touch();
    },

    /**
     * Démarre une nouvelle session vide pour un enfant — l'objet est rendu
     * pour que `SessionView` y écrive ses réponses au fil du parcours.
     */
    startSession(childId: string, ageAtSession: number): Session {
      const child = this.childById(childId);
      if (!child) throw new Error(`Enfant introuvable : ${childId}`);
      const session: Session = {
        id: uuid(),
        date: nowIso(),
        age_at_session: ageAtSession,
        questionnaire_version: questionnaireVersionFor(ageAtSession),
        duration_seconds: 0,
        answers: emptyAnswers(),
        profile_summary: emptyProfile(),
      };
      child.sessions.push(session);
      this.touch();
      return session;
    },

    touch(): void {
      if (!this.family) return;
      this.family.last_updated = nowIso();
      this.scheduleSave();
    },

    scheduleSave(): void {
      if (this.saveTimer) clearTimeout(this.saveTimer);
      this.saveTimer = setTimeout(() => {
        if (this.family) void saveFamily(this.family);
      }, AUTOSAVE_MS);
    },

    async flush(): Promise<void> {
      if (this.saveTimer) {
        clearTimeout(this.saveTimer);
        this.saveTimer = null;
      }
      if (this.family) await saveFamily(this.family);
    },
  },
});
