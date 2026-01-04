import { describe, it, expect } from 'vitest';
import { matchRecipe, matchCategory } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';

describe('matchRecipe', () => {
  it('matches recipe by name (partial match)', () => {
    const recipe = makeRecipe({ name: 'Spaghetti Carbonara' });
    expect(matchRecipe(recipe, 'spaghetti')).toBe(true);
    expect(matchRecipe(recipe, 'carbon')).toBe(true);
  });

  it('matches recipe by description (partial match)', () => {
    const recipe = makeRecipe({
      description: 'A delicious Italian pasta dish',
    });
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
    const recipe = makeRecipe({
      equipments: ['Pan', 'Knife', 'Cutting Board'],
    });
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

describe('matchCategory', () => {
  it('returns true for empty category set', () => {
    const recipe = makeRecipe();
    expect(matchCategory(recipe, new Set())).toBe(true);
  });

  it('matches recipe by tag', () => {
    const recipe = makeRecipe({ tags: ['Quick', 'Easy', 'Vegetarian'] });
    expect(matchCategory(recipe, new Set(['Quick']))).toBe(true);
    expect(matchCategory(recipe, new Set(['Easy']))).toBe(true);
  });

  it('matches recipe by cuisine', () => {
    const recipe = makeRecipe({ cuisine: 'Italian' });
    expect(matchCategory(recipe, new Set(['Italian']))).toBe(true);
  });

  it('matches recipe by type', () => {
    const recipe = makeRecipe({ type: 'dinner' });
    expect(matchCategory(recipe, new Set(['dinner']))).toBe(true);
  });

  it('matches recipe with multiple categories from different fields', () => {
    const recipe = makeRecipe({
      tags: ['Quick', 'Healthy'],
      cuisine: 'Italian',
      type: 'dinner',
    });
    expect(matchCategory(recipe, new Set(['Quick', 'Italian']))).toBe(true);
    expect(matchCategory(recipe, new Set(['Healthy', 'dinner']))).toBe(true);
    expect(
      matchCategory(recipe, new Set(['Quick', 'Italian', 'dinner'])),
    ).toBe(true);
  });

  it('returns false when one category does not match', () => {
    const recipe = makeRecipe({
      tags: ['Quick'],
      cuisine: 'Italian',
      type: 'dinner',
    });
    expect(matchCategory(recipe, new Set(['Quick', 'Mexican']))).toBe(false);
  });

  it('returns false when no categories match', () => {
    const recipe = makeRecipe({
      tags: ['Quick'],
      cuisine: 'Italian',
      type: 'dinner',
    });
    expect(matchCategory(recipe, new Set(['Slow', 'Mexican']))).toBe(false);
  });

  it('requires all categories to match (AND logic)', () => {
    const recipe = makeRecipe({
      tags: ['Quick', 'Easy'],
      cuisine: 'Italian',
      type: 'lunch',
    });
    expect(matchCategory(recipe, new Set(['Quick', 'Easy', 'Italian']))).toBe(
      true,
    );
    expect(
      matchCategory(recipe, new Set(['Quick', 'Easy', 'Italian', 'breakfast'])),
    ).toBe(false);
  });
});
