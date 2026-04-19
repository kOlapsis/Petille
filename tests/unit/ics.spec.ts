import { describe, it, expect } from 'vitest';
import { buildReminderIcs, icsFilename } from '@/lib/ics';
import type { Child } from '@/lib/schema';

function fakeChild(): Child {
  return {
    id: '12345678-aaaa-bbbb-cccc-deadbeef0000',
    first_name: 'Éléa',
    birth_year: 2019,
    sessions: [],
  };
}

describe('buildReminderIcs', () => {
  it('emits a valid-ish VCALENDAR with yearly recurrence and a 1-day alarm', () => {
    const ics = buildReminderIcs(fakeChild(), { from: new Date('2026-04-19T10:00:00Z') });
    expect(ics).toContain('BEGIN:VCALENDAR');
    expect(ics).toContain('END:VCALENDAR');
    expect(ics).toContain('BEGIN:VEVENT');
    expect(ics).toContain('RRULE:FREQ=YEARLY');
    expect(ics).toContain('BEGIN:VALARM');
    expect(ics).toContain('TRIGGER:-P1D');
    expect(ics).toContain('SUMMARY:Refaire Pétille avec Éléa');
    // next year, same day
    expect(ics).toMatch(/DTSTART:20270419T100000Z/);
  });

  it('escapes commas/semicolons in SUMMARY but keeps description/backslash', () => {
    const child: Child = { ...fakeChild(), first_name: 'Jean; Paul, fils' };
    const ics = buildReminderIcs(child);
    expect(ics).toContain('SUMMARY:Refaire Pétille avec Jean\\; Paul\\, fils');
  });

  it('uses CRLF line endings as required by RFC 5545', () => {
    const ics = buildReminderIcs(fakeChild());
    expect(ics.includes('\r\n')).toBe(true);
  });
});

describe('icsFilename', () => {
  it('slugifies accents and special characters', () => {
    const name = icsFilename(fakeChild());
    expect(name).toBe('petille-rappel-elea.ics');
  });

  it('falls back to id prefix when first name slugs to empty', () => {
    const child: Child = { ...fakeChild(), first_name: '!!!' };
    expect(icsFilename(child)).toMatch(/^petille-rappel-[a-f0-9]{8}\.ics$/);
  });
});
