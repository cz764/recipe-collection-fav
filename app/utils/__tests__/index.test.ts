import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { randomRecipeIndexFromDate, matchRecipe } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';

describe('randomRecipeIndexFromDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns an index within bounds of array length', () => {
    const arrayLength = 5;
    const result = randomRecipeIndexFromDate(arrayLength);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(arrayLength);
  });

  it('returns the same index for the same date', () => {
    vi.setSystemTime(new Date('2025-12-16'));

    const arrayLength = 10;
    const result1 = randomRecipeIndexFromDate(arrayLength);
    const result2 = randomRecipeIndexFromDate(arrayLength);

    expect(result1).toEqual(result2);
  });

  it('returns different indices for different dates', () => {
    const arrayLength = 10;

    vi.setSystemTime(new Date('2025-06-15'));
    const result1 = randomRecipeIndexFromDate(arrayLength);

    vi.setSystemTime(new Date('2025-06-16'));
    const result2 = randomRecipeIndexFromDate(arrayLength);

    expect(result1).not.toEqual(result2);
  });

  it('handles array length of 1', () => {
    const result = randomRecipeIndexFromDate(1);
    expect(result).toEqual(0);
  });

  it('computes index correctly based on day of year', () => {
    vi.setSystemTime(new Date('2025-03-10')); // day 68 of year

    const arrayLength = 7;
    // Expected: 68 % 7 = 5
    const result = randomRecipeIndexFromDate(arrayLength);
    expect(result).toEqual(5);
  });
});

describe('matchRecipe', () => {
  it('matches recipe by name (partial match)', () => {
    const recipe = makeRecipe({ name: 'Spaghetti Carbonara' });
    expect(matchRecipe(recipe, 'spaghetti')).toBe(true);
    expect(matchRecipe(recipe, 'carbon')).toBe(true);
  });

  it('matches recipe by description (partial match)', () => {
    const recipe = makeRecipe({ description: 'A delicious Italian pasta dish' });
    expect(matchRecipe(recipe, 'italian')).toBe(true);
    expect(matchRecipe(recipe, 'pasta')).toBe(true);
  });

  it('matches recipe by cuisine (partial match)', () => {
    const recipe = makeRecipe({ cuisine: 'Italian' });
    expect(matchRecipe(recipe, 'ital')).toBe(true);
  });

  it('matches recipe by tag (full string match)', () => {
    const recipe = makeRecipe({ tags: ['Quick', 'Easy', 'Vegetarian'] });
    expect(matchRecipe(recipe, 'quick')).toBe(true);
    expect(matchRecipe(recipe, 'vegetarian')).toBe(true);
  });

  it('does not match partial tag', () => {
    const recipe = makeRecipe({ tags: ['Vegetarian'] });
    expect(matchRecipe(recipe, 'veg')).toBe(false);
  });

  it('matches recipe by ingredient name (full string match)', () => {
    const recipe = makeRecipe({
      ingredients: [
        { name: 'Tomato', amount: 2, unit: 'pieces' },
        { name: 'Garlic', amount: 3, unit: 'cloves' },
      ],
    });
    expect(matchRecipe(recipe, 'tomato')).toBe(true);
    expect(matchRecipe(recipe, 'garlic')).toBe(true);
  });

  it('does not match partial ingredient name', () => {
    const recipe = makeRecipe({
      ingredients: [{ name: 'Tomato', amount: 2, unit: 'pieces' }],
    });
    expect(matchRecipe(recipe, 'tom')).toBe(false);
  });

  it('matches recipe by equipment (full string match)', () => {
    const recipe = makeRecipe({ equipments: ['Pan', 'Knife', 'Cutting Board'] });
    expect(matchRecipe(recipe, 'pan')).toBe(true);
    expect(matchRecipe(recipe, 'knife')).toBe(true);
  });

  it('does not match partial equipment', () => {
    const recipe = makeRecipe({ equipments: ['Cutting Board'] });
    expect(matchRecipe(recipe, 'cutting')).toBe(false);
  });

  it('is case insensitive', () => {
    const recipe = makeRecipe({ name: 'Spaghetti Carbonara' });
    expect(matchRecipe(recipe, 'SPAGHETTI')).toBe(true);
    expect(matchRecipe(recipe, 'SpAgHeTtI')).toBe(true);
  });

  it('returns false when no match found', () => {
    const recipe = makeRecipe({
      name: 'Spaghetti',
      description: 'Pasta dish',
      cuisine: 'Italian',
      tags: ['Dinner'],
      ingredients: [{ name: 'Pasta', amount: 1, unit: 'lb' }],
      equipments: ['Pot'],
    });
    expect(matchRecipe(recipe, 'chicken')).toBe(false);
  });
});
