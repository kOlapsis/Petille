/**
 * Catalogue des libellés humains à partir d'une `key` stable.
 * Construit dynamiquement à partir des questionnaires actifs pour rester en
 * phase avec le contenu sans dupliquer la traduction.
 */
import { resolveQuestionnaire } from '@/content/questionnaires';
import type { QuestionnaireVersion } from '@/lib/schema';

interface LabelEntry {
  label: string;
  emoji?: string;
}

interface LabelCatalog {
  themes: Record<string, LabelEntry>;
  actions: Record<string, LabelEntry>;
  context: Record<string, Record<string, LabelEntry>>;
  magicDay: Record<string, LabelEntry>;
}

const CACHE = new Map<QuestionnaireVersion, LabelCatalog>();

export function buildCatalog(version: QuestionnaireVersion): LabelCatalog {
  const cached = CACHE.get(version);
  if (cached) return cached;

  const q = resolveQuestionnaire(version);
  const catalog: LabelCatalog = { themes: {}, actions: {}, context: {}, magicDay: {} };

  for (const step of q.steps) {
    if (step.kind === 'themes-pair') {
      for (const pair of step.pairs) {
        catalog.themes[pair.left.key] = { label: pair.left.label, emoji: pair.left.emoji };
        catalog.themes[pair.right.key] = { label: pair.right.label, emoji: pair.right.emoji };
      }
    } else if (step.kind === 'themes-rating') {
      for (const section of step.sections) {
        for (const item of section.items) {
          catalog.themes[item.key] = { label: item.label, emoji: item.emoji };
        }
      }
    } else if (step.kind === 'actions') {
      for (const group of step.groups) {
        for (const item of group.items) {
          catalog.actions[item.key] = { label: item.label };
        }
      }
    } else if (step.kind === 'context') {
      for (const question of step.questions) {
        catalog.context[question.key] = {};
        for (const opt of question.options) {
          catalog.context[question.key]![opt.key] = { label: opt.label, emoji: opt.emoji };
        }
      }
    } else if (step.kind === 'magic-day') {
      for (const field of step.fields) {
        catalog.magicDay[field.key] = { label: field.label };
      }
    }
  }

  CACHE.set(version, catalog);
  return catalog;
}

export function themeLabel(version: QuestionnaireVersion, key: string): LabelEntry {
  return buildCatalog(version).themes[key] ?? { label: key };
}

export function actionLabel(version: QuestionnaireVersion, key: string): LabelEntry {
  return buildCatalog(version).actions[key] ?? { label: key };
}

export function contextOptionLabel(
  version: QuestionnaireVersion,
  questionKey: string,
  optionKey: string
): LabelEntry {
  return buildCatalog(version).context[questionKey]?.[optionKey] ?? { label: optionKey };
}

export function magicDayFieldLabel(version: QuestionnaireVersion, key: string): LabelEntry {
  return buildCatalog(version).magicDay[key] ?? { label: key };
}
