/**
 * Modèle de données Pétille — source de vérité TypeScript.
 *
 * Toute évolution du JSON ↔ types passe par un bump de SCHEMA_VERSION
 * et l'ajout d'une migration dans `importJson.ts`.
 */

export const SCHEMA_VERSION = 2 as const;
export type SchemaVersion = typeof SCHEMA_VERSION;

export type QuestionnaireVersion = '6-8-v1' | '9-11-v1';

export type AgeBand = '6-8' | '9-11';

/* ---- Réponses ---------------------------------------------------------- */

/** Étape Thèmes — 6-8 : Record<key, 0|1|2> ; 9-11 : Record<key, 0|1|2|3>. */
export type ThemeAnswers = Record<string, number>;

/** Étape Actions — liste des keys cochées. */
export type ActionAnswers = string[];

/** Étape Contexte — un radio par question, key→value. */
export type ContextAnswers = Record<string, string>;

/** Étape Journée magique (6-8) ou Projections (9-11) — texte libre + champs. */
export interface MagicDayAnswers {
  /** Texte libre (réponses de l'enfant ou retranscrites par l'adulte). */
  text: string;
  /** Photo dataURL d'un dessin (optionnel). */
  photo_data_url: string | null;
  /** Champs spécifiques 9-11 (lettre, 3 personnes admirées, etc.). */
  extras?: Record<string, string>;
}

export interface SessionAnswers {
  themes: ThemeAnswers;
  actions: ActionAnswers;
  context: ContextAnswers;
  magic_day: MagicDayAnswers;
}

/* ---- Profil de synthèse (sans aucun métier) ---------------------------- */

export interface ProfileSummary {
  /** Top 3-5 thèmes par score décroissant. */
  top_themes: string[];
  /** Top 3-5 actions par fréquence. */
  top_actions: string[];
  /** Étiquette compacte du contexte (ex. "outdoor_small_group_varied"). */
  context_label: string;
}

/* ---- Sessions, enfants, famille --------------------------------------- */

export interface Session {
  id: string;
  date: string; // ISO 8601 — date de démarrage
  /** Date de finalisation (ISO 8601) ou null tant que c'est un brouillon. */
  completed_at: string | null;
  age_at_session: number;
  questionnaire_version: QuestionnaireVersion;
  duration_seconds: number;
  answers: SessionAnswers;
  profile_summary: ProfileSummary;
}

export function isDraftSession(s: Session): boolean {
  return s.completed_at === null;
}

/**
 * Migre un carnet lu depuis IndexedDB vers la version courante.
 * Les imports JSON passent par `importJson.ts` qui a son propre pipeline (déchiffrement, validation) ;
 * ici c'est le pendant pour la base locale, qui peut contenir un v1 après mise à jour de l'app.
 */
export function migrateFamilyInPlace(family: Family): Family {
  if ((family.schema_version as number) < 2) {
    for (const child of family.children) {
      for (const s of child.sessions) {
        if (s.completed_at === undefined || s.completed_at === null) {
          s.completed_at = s.date;
        }
      }
    }
    family.schema_version = SCHEMA_VERSION;
  }
  return family;
}

export interface Child {
  id: string;
  first_name: string;
  birth_year: number;
  sessions: Session[];
}

export interface Family {
  schema_version: SchemaVersion;
  family_id: string;
  created_at: string;
  last_updated: string;
  children: Child[];
}

/* ---- Helpers de fabrique ---------------------------------------------- */

export function emptyAnswers(): SessionAnswers {
  return {
    themes: {},
    actions: [],
    context: {},
    magic_day: { text: '', photo_data_url: null },
  };
}

export function emptyProfile(): ProfileSummary {
  return { top_themes: [], top_actions: [], context_label: '' };
}

/**
 * Calcule l'âge "scolaire" à partir d'une birth_year.
 * Pas de date de naissance → granularité année, suffisant pour la tranche.
 */
export function ageFromBirthYear(birthYear: number, atDate: Date = new Date()): number {
  return atDate.getFullYear() - birthYear;
}

export function ageBandForAge(age: number): AgeBand {
  return age <= 8 ? '6-8' : '9-11';
}

export function questionnaireVersionFor(age: number): QuestionnaireVersion {
  return ageBandForAge(age) === '6-8' ? '6-8-v1' : '9-11-v1';
}
