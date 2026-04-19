/**
 * Calculs de synthèse — fonctions pures, testables sans DOM.
 *
 * On ne mappe JAMAIS un profil vers un métier. On rend juste un classement
 * lisible des appétences déclarées par l'enfant.
 */
import type {
  ContextAnswers,
  ProfileSummary,
  SessionAnswers,
  ThemeAnswers,
} from './schema';

const TOP_THEMES_N = 5;
const TOP_ACTIONS_N = 5;

/** Retourne les `n` thèmes au score le plus élevé (ex aequo : ordre alphabétique stable). */
export function topThemes(themes: ThemeAnswers, n: number = TOP_THEMES_N): string[] {
  return Object.entries(themes)
    .filter(([, score]) => score > 0)
    .sort(([ka, va], [kb, vb]) => (vb - va) || ka.localeCompare(kb))
    .slice(0, n)
    .map(([k]) => k);
}

/** Renvoie au plus `n` actions cochées (en gardant l'ordre fourni). */
export function topActions(actions: string[], n: number = TOP_ACTIONS_N): string[] {
  return actions.slice(0, n);
}

/**
 * Étiquette du contexte sous forme `social_space_pace`.
 * Si une dimension manque, la remplace par `unknown` pour rester stable.
 */
export function contextLabel(context: ContextAnswers): string {
  const social = context.social ?? 'unknown';
  const space = context.space ?? 'unknown';
  const pace = context.pace ?? 'unknown';
  return `${social}_${space}_${pace}`;
}

export function summarize(answers: SessionAnswers): ProfileSummary {
  return {
    top_themes: topThemes(answers.themes),
    top_actions: topActions(answers.actions),
    context_label: contextLabel(answers.context),
  };
}
