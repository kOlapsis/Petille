/**
 * Calculs de synthèse — fonctions pures, testables sans DOM.
 *
 * On ne mappe JAMAIS un profil vers un métier. On rend juste un classement
 * lisible des appétences déclarées par l'enfant.
 */
import { resolveQuestionnaire } from '@/content/questionnaires';
import type {
  ContextAnswers,
  ProfileSummary,
  QuestionnaireVersion,
  SessionAnswers,
  ThemeAnswers,
} from './schema';

const TOP_THEMES_N = 5;
const TOP_ACTIONS_N = 5;

/**
 * Retourne les thèmes dominants, triés par score décroissant (alphabétique en ex aequo).
 *
 * Règle : tous les thèmes au score maximum sont toujours conservés — on ne
 * coupe jamais un « les deux » en deux. Si ce top-tier est plus petit que
 * `n`, on complète avec les scores inférieurs jusqu'à atteindre `n`.
 */
export function topThemes(themes: ThemeAnswers, n: number = TOP_THEMES_N): string[] {
  const entries = Object.entries(themes)
    .filter(([, score]) => score > 0)
    .sort(([ka, va], [kb, vb]) => (vb - va) || ka.localeCompare(kb));
  if (entries.length === 0) return [];
  const topScore = entries[0]![1];
  const topTier = entries.filter(([, s]) => s === topScore);
  if (topTier.length >= n) return topTier.map(([k]) => k);
  return entries.slice(0, n).map(([k]) => k);
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

/**
 * Thèmes à afficher dans la synthèse, rangés dans l'ordre du questionnaire.
 *
 * Pour le 6-8 (paires), on parcourt chaque paire dans l'ordre posé à l'enfant
 * et on garde tout score > 0 — les deux faces d'un « les deux » restent donc
 * collées. Pour le 9-11 (notes), on utilise `topThemes` puis on ré-ordonne
 * selon l'ordre de déclaration pour garder les regroupements par section.
 */
export function displayThemes(themes: ThemeAnswers, version: QuestionnaireVersion): string[] {
  const q = resolveQuestionnaire(version);
  const result: string[] = [];
  for (const step of q.steps) {
    if (step.kind === 'themes-pair') {
      for (const pair of step.pairs) {
        if ((themes[pair.left.key] ?? 0) > 0) result.push(pair.left.key);
        if ((themes[pair.right.key] ?? 0) > 0) result.push(pair.right.key);
      }
    } else if (step.kind === 'themes-rating') {
      const keep = new Set(topThemes(themes));
      for (const section of step.sections) {
        for (const item of section.items) {
          if (keep.has(item.key)) result.push(item.key);
        }
      }
    }
  }
  return result;
}

export function summarize(answers: SessionAnswers): ProfileSummary {
  return {
    top_themes: topThemes(answers.themes),
    top_actions: topActions(answers.actions),
    context_label: contextLabel(answers.context),
  };
}
