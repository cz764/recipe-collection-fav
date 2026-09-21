import { describe, expect, it } from 'vitest';
import { parseRecipeSearchParams } from '../searchParams';

describe('parseRecipeSearchParams', () => {
  it('normalizes supported filters and ignores unrelated parameters', () => {
    expect(
      parseRecipeSearchParams({
        cuisine: ' Chinese ',
        type: 'DINNER',
        extra: 'value',
      }),
    ).toEqual({ cuisine: 'chinese', type: 'dinner' });
  });

  it('handles missing and blank values', () => {
    expect(parseRecipeSearchParams({})).toEqual({
      cuisine: undefined,
      type: undefined,
    });
    expect(parseRecipeSearchParams({ cuisine: ' ', type: '' })).toEqual({
      cuisine: undefined,
      type: undefined,
    });
  });

  it('uses the first value for repeated parameters', () => {
    expect(
      parseRecipeSearchParams({
        cuisine: ['Chinese', 'Italian'],
        type: ['Dinner', 'Dessert'],
      }),
    ).toEqual({ cuisine: 'chinese', type: 'dinner' });
  });
});
