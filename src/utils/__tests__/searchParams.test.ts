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
    ).toEqual({
      cuisine: 'chinese',
      meal: 'dinner',
      type: 'bakery',
      q: undefined,
      tag: undefined,
    });
  });

  it('handles missing and blank values', () => {
    expect(parseRecipeSearchParams({})).toEqual({
      q: undefined,
      tag: undefined,
      cuisine: undefined,
      meal: undefined,
      type: undefined,
    });
    expect(parseRecipeSearchParams({ cuisine: ' ', meal: '' })).toEqual({
      q: undefined,
      tag: undefined,
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
    ).toEqual({
      cuisine: 'chinese',
      meal: 'dinner',
      type: 'bakery',
      q: undefined,
      tag: undefined,
    });
  });
});

it('trims search text, preserves case, and uses the first repeated value', () => {
  expect(
    parseRecipeSearchParams({ q: [' Egg & Cheese ', 'bread'] }),
  ).toMatchObject({ q: 'Egg & Cheese' });
  expect(parseRecipeSearchParams({ q: '  ' })).toMatchObject({ q: undefined });
});

it('normalizes tag values, preserving the first-value rule', () => {
  expect(
    parseRecipeSearchParams({
      tag: [' Vegetarian ', 'one-pot'],
    }),
  ).toMatchObject({ tag: 'vegetarian' });
  expect(parseRecipeSearchParams({ tag: ' ' })).toMatchObject({
    tag: undefined,
  });
});
