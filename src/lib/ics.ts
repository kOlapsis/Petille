/**
 * Génération d'un fichier .ics RFC 5545 pour rappeler de refaire Pétille
 * dans un an. Pas de dépendance runtime : le format est simple et stable.
 */
import type { Child } from './schema';

export interface IcsOptions {
  /** Date de départ (par défaut aujourd'hui). */
  from?: Date;
  /** Années d'avance (1 par défaut). */
  yearsAhead?: number;
}

function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

function toIcsDate(d: Date): string {
  return (
    `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
    `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`
  );
}

function toIcsDay(d: Date): string {
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}`;
}

/**
 * Construit un VCALENDAR avec un VEVENT récurrent annuel et une alarme 1 jour avant.
 */
export function buildReminderIcs(child: Child, options: IcsOptions = {}): string {
  const from = options.from ?? new Date();
  const years = options.yearsAhead ?? 1;
  const target = new Date(from);
  target.setUTCFullYear(target.getUTCFullYear() + years);
  target.setUTCHours(10, 0, 0, 0);

  const uid = `petille-${child.id}-${toIcsDay(target)}@petille.local`;
  const dtstamp = toIcsDate(new Date());
  const dtstart = toIcsDate(target);

  const summary = `Refaire Pétille avec ${child.first_name}`;
  const description =
    `Un an déjà ! C'est peut-être le moment de refaire le carnet d'appétences de ${child.first_name}.\\n` +
    `Pas d'obligation : on attend une envie, pas une case à cocher.`;

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Pétille//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${dtstamp}`,
    `DTSTART:${dtstart}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${description}`,
    'RRULE:FREQ=YEARLY',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    `DESCRIPTION:${escapeText(summary)}`,
    'TRIGGER:-P1D',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ];
  return lines.join('\r\n');
}

function escapeText(v: string): string {
  return v.replace(/[\\,;]/g, (m) => `\\${m}`).replace(/\n/g, '\\n');
}

export function icsFilename(child: Child): string {
  const slug = child.first_name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  return `petille-rappel-${slug || child.id.slice(0, 8)}.ics`;
}
