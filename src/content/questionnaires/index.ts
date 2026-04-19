/**
 * Index des questionnaires versionnés. Une seule fonction de résolution
 * pour pouvoir étendre sans toucher aux composants.
 */
import type { QuestionnaireVersion } from '@/lib/schema';
import type { Questionnaire } from './types';
import { questionnaire68v1 } from './6-8-v1';
import { questionnaire911v1 } from './9-11-v1';

const REGISTRY: Record<QuestionnaireVersion, Questionnaire> = {
  '6-8-v1': questionnaire68v1,
  '9-11-v1': questionnaire911v1,
};

export function resolveQuestionnaire(version: QuestionnaireVersion): Questionnaire {
  const q = REGISTRY[version];
  if (!q) throw new Error(`Questionnaire inconnu : ${version}`);
  return q;
}

export type { Questionnaire } from './types';
