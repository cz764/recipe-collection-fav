import { describe, it, expect } from 'vitest';
import { matchRecipe, matchCategory, matchFilters } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';
import type { FilterMap } from '@/data/filter';

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

describe('matchFilters', () => {
  it('returns true for empty filterMap', () => {
    const recipe = makeRecipe();
    const filterMap: FilterMap = new Map();
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns true when all filter values are empty arrays', () => {
    const recipe = makeRecipe({ type: 'dinner', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', []);
    filterMap.set('language', []);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('matches recipe by type filter', () => {
    const recipe = makeRecipe({ type: 'breakfast' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', ['breakfast']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('matches recipe by language filter', () => {
    const recipe = makeRecipe({ language: 'ch' });
    const filterMap: FilterMap = new Map();
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns false when type does not match', () => {
    const recipe = makeRecipe({ type: 'dinner' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', ['breakfast']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });

  it('returns false when language does not match', () => {
    const recipe = makeRecipe({ language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });

  it('matches when filter has multiple values (OR within key)', () => {
    const recipe = makeRecipe({ type: 'lunch' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', ['breakfast', 'lunch', 'dinner']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('requires all keys to match (AND logic across keys)', () => {
    const recipe = makeRecipe({ type: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', ['breakfast']);
    filterMap.set('language', ['en']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns false when one of multiple keys does not match', () => {
    const recipe = makeRecipe({ type: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', ['breakfast']);
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });

  it('skips keys with empty arrays and applies the rest', () => {
    const recipe = makeRecipe({ type: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', []);
    filterMap.set('language', ['en']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns false when non-empty key fails even if other keys are empty', () => {
    const recipe = makeRecipe({ type: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('type', []);
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });
});
