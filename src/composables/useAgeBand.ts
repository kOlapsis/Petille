/**
 * Détermine la tranche d'âge applicable et la version de questionnaire à servir.
 */
import {
  ageBandForAge,
  ageFromBirthYear,
  questionnaireVersionFor,
  type AgeBand,
  type QuestionnaireVersion,
} from '@/lib/schema';

export interface AgeBandInfo {
  age: number;
  band: AgeBand;
  questionnaireVersion: QuestionnaireVersion;
  /** True si en dehors de la tranche 6-11 supportée. */
  outOfRange: boolean;
}

export function useAgeBand(birthYear: number, atDate: Date = new Date()): AgeBandInfo {
  const age = ageFromBirthYear(birthYear, atDate);
  return {
    age,
    band: ageBandForAge(age),
    questionnaireVersion: questionnaireVersionFor(age),
    outOfRange: age < 6 || age > 11,
  };
}
