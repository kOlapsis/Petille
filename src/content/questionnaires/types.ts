/**
 * Modèle commun aux deux questionnaires (6-8 et 9-11).
 * Les keys (`animals`, `console`, `small_group`, …) sont stables — elles
 * apparaissent dans la donnée stockée et survivent aux changements de wording.
 */
import type { QuestionnaireVersion } from '@/lib/schema';

export type StepKind = 'themes-pair' | 'themes-rating' | 'actions' | 'context' | 'magic-day';

/** Un thème = une « case à entourer » (6-8) ou une ligne notée (9-11). */
export interface ThemeItem {
  key: string;
  emoji: string;
  label: string;
}

/** Étape Thèmes pour 6-8 ans : paires d'univers. */
export interface ThemePair {
  /** Identifiant unique de la paire (sert au tracking d'avancement). */
  pairId: string;
  /** Texte de l'invite, court ; emojis inclus. */
  prompt?: string;
  left: ThemeItem;
  right: ThemeItem;
}

export interface ThemesPairStep {
  kind: 'themes-pair';
  title: string;
  intro?: string;
  pairs: ThemePair[];
}

/** Étape Thèmes pour 9-11 ans : sections + items notés 0-3. */
export interface RatingSection {
  key: string;
  title: string;
  emoji: string;
  items: ThemeItem[];
}

export interface ThemesRatingStep {
  kind: 'themes-rating';
  title: string;
  intro?: string;
  scale: { min: number; max: number; labels: string[] };
  sections: RatingSection[];
}

/** Étape Actions : groupes d'items à cocher. */
export interface ActionItem {
  key: string;
  label: string;
}

export interface ActionGroup {
  key: string;
  title: string;
  items: ActionItem[];
}

export interface ActionsStep {
  kind: 'actions';
  title: string;
  intro?: string;
  groups: ActionGroup[];
}

/** Étape Contexte : questions à réponse unique parmi options. */
export interface ContextOption {
  key: string;
  emoji?: string;
  label: string;
}

export interface ContextQuestion {
  key: string;
  label: string;
  options: ContextOption[];
}

export interface ContextStep {
  kind: 'context';
  title: string;
  intro?: string;
  questions: ContextQuestion[];
}

/** Étape Magic Day / Projections : champs texte libres + photo optionnelle. */
export interface MagicDayField {
  key: string;
  label: string;
  placeholder?: string;
  multiline?: boolean;
}

export interface MagicDayStep {
  kind: 'magic-day';
  title: string;
  intro?: string;
  fields: MagicDayField[];
  /** True si l'étape accepte une photo de dessin. */
  allowPhoto: boolean;
  /** Texte adulte affiché à la fin de l'étape (transition vers la synthèse). */
  closingNote?: string;
}

export type Step =
  | ThemesPairStep
  | ThemesRatingStep
  | ActionsStep
  | ContextStep
  | MagicDayStep;

export interface Questionnaire {
  version: QuestionnaireVersion;
  minAge: number;
  maxAge: number;
  estimatedMinutes: number;
  intro: string;
  steps: Step[];
  /** Texte adulte rappelé à la toute fin (avant la synthèse). */
  adultClosing: string;
}
