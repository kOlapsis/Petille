import { describe, it, expect } from 'vitest';
import { contextLabel, summarize, topActions, topThemes } from '@/lib/profile';

describe('topThemes', () => {
  it('keeps only positive scores and sorts by score desc', () => {
    const themes = { a: 0, b: 3, c: 1, d: 2 };
    expect(topThemes(themes)).toEqual(['b', 'd', 'c']);
  });

  it('breaks ties alphabetically for deterministic output', () => {
    const themes = { zebra: 2, alpha: 2, mango: 2 };
    expect(topThemes(themes)).toEqual(['alpha', 'mango', 'zebra']);
  });

  it('respects the n cap', () => {
    const themes = { a: 5, b: 4, c: 3, d: 2, e: 1 };
    expect(topThemes(themes, 2)).toEqual(['a', 'b']);
  });
});

describe('topActions', () => {
  it('preserves insertion order and caps length', () => {
    expect(topActions(['x', 'y', 'z', 'w'], 2)).toEqual(['x', 'y']);
  });
});

describe('contextLabel', () => {
  it('builds social_space_pace with unknown fallback', () => {
    expect(contextLabel({ social: 'alone', space: 'outside', pace: 'slow_deep' })).toBe(
      'alone_outside_slow_deep'
    );
    expect(contextLabel({ social: 'alone' })).toBe('alone_unknown_unknown');
  });
});

describe('summarize', () => {
  it('bundles themes + actions + context', () => {
    const summary = summarize({
      themes: { a: 2, b: 0 },
      actions: ['x'],
      context: { social: 'small_group', space: 'inside', pace: 'mix' },
      magic_day: { text: '', photo_data_url: null },
    });
    expect(summary.top_themes).toEqual(['a']);
    expect(summary.top_actions).toEqual(['x']);
    expect(summary.context_label).toBe('small_group_inside_mix');
  });
});
