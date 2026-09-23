import { describe, expect, it } from 'vitest';
import { parseRecipeSearchParams } from '../searchParams';

describe('parseRecipeSearchParams', () => {
  it('normalizes supported filters and ignores unrelated parameters', () => {
    expect(
      parseRecipeSearchParams({
        cuisine: ' Chinese ',
        meal: 'DINNER',
        type: ' BAKERY ',
        extra: 'value',
      }),
    ).toEqual({ cuisine: 'chinese', meal: 'dinner', type: 'bakery' });
  });

  it('handles missing and blank values', () => {
    expect(parseRecipeSearchParams({})).toEqual({
      cuisine: undefined,
      meal: undefined,
      type: undefined,
    });
    expect(parseRecipeSearchParams({ cuisine: ' ', meal: '' })).toEqual({
      cuisine: undefined,
      meal: undefined,
      type: undefined,
    });
  });

  it('uses the first value for repeated parameters', () => {
    expect(
      parseRecipeSearchParams({
        cuisine: ['Chinese', 'Italian'],
        meal: ['Dinner', 'Dessert'],
        type: ['Bakery', 'Soup'],
      }),
    ).toEqual({ cuisine: 'chinese', meal: 'dinner', type: 'bakery' });
  });
});
