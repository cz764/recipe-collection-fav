import { describe, expect, it } from 'vitest';
import { selectFeaturedRecipes } from '../featured';

const collection = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

describe('selectFeaturedRecipes', () => {
  it('picks three distinct items for a date, in a stable order', () => {
    const picks = selectFeaturedRecipes(collection, new Date(2026, 9, 12));
    expect(picks).toHaveLength(3);
    expect(new Set(picks).size).toBe(3);
    expect(selectFeaturedRecipes(collection, new Date(2026, 9, 12))).toEqual(
      picks,
    );
  });

  it('ignores the time of day but changes with the calendar date', () => {
    const midnight = selectFeaturedRecipes(
      collection,
      new Date(2026, 6, 10, 0, 15),
    );
    const evening = selectFeaturedRecipes(
      collection,
      new Date(2026, 6, 10, 23, 59),
    );
    expect(evening).toEqual(midnight);

    const days = Array.from({ length: 10 }, (_, offset) =>
      selectFeaturedRecipes(collection, new Date(2026, 6, 11 + offset)),
    );
    expect(days.some((picks) => picks.join() !== midnight.join())).toBe(true);
  });

  it('returns every item when the collection is smaller than the count', () => {
    expect(selectFeaturedRecipes(['x', 'y'], new Date(2026, 0, 1))).toEqual(
      expect.arrayContaining(['x', 'y']),
    );
    expect(selectFeaturedRecipes([], new Date(2026, 0, 1))).toEqual([]);
  });
});
