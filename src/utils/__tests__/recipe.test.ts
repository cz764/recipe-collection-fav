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
    const recipe = makeRecipe({ cuisine: 'italian' });
    expect(matchRecipe(recipe, 'ital')).toBe(true);
  });

  it('matches recipe by tag (full string match)', () => {
    const recipe = makeRecipe({ tags: ['one-pot', 'bread', 'vegetarian'] });
    expect(matchRecipe(recipe, 'one-pot')).toBe(true);
    expect(matchRecipe(recipe, 'vegetarian')).toBe(true);
  });

  it('does not match partial tag', () => {
    const recipe = makeRecipe({ tags: ['vegetarian'] });
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
      cuisine: 'italian',
      tags: ['dough'],
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
    const recipe = makeRecipe({ tags: ['one-pot', 'bread', 'vegetarian'] });
    expect(matchCategory(recipe, new Set(['one-pot']))).toBe(true);
    expect(matchCategory(recipe, new Set(['bread']))).toBe(true);
  });

  it('matches recipe by cuisine', () => {
    const recipe = makeRecipe({ cuisine: 'italian' });
    expect(matchCategory(recipe, new Set(['italian']))).toBe(true);
  });

  it('matches recipe by meal', () => {
    const recipe = makeRecipe({ meal: 'dinner' });
    expect(matchCategory(recipe, new Set(['dinner']))).toBe(true);
  });

  it('matches recipe with multiple categories from different fields', () => {
    const recipe = makeRecipe({
      tags: ['one-pot', 'high-protein'],
      cuisine: 'italian',
      meal: 'dinner',
    });
    expect(matchCategory(recipe, new Set(['one-pot', 'italian']))).toBe(true);
    expect(matchCategory(recipe, new Set(['high-protein', 'dinner']))).toBe(
      true,
    );
    expect(
      matchCategory(recipe, new Set(['one-pot', 'italian', 'dinner'])),
    ).toBe(true);
  });

  it('returns false when one category does not match', () => {
    const recipe = makeRecipe({
      tags: ['one-pot'],
      cuisine: 'italian',
      meal: 'dinner',
    });
    expect(matchCategory(recipe, new Set(['one-pot', 'mexican']))).toBe(false);
  });

  it('returns false when no categories match', () => {
    const recipe = makeRecipe({
      tags: ['one-pot'],
      cuisine: 'italian',
      meal: 'dinner',
    });
    expect(matchCategory(recipe, new Set(['Slow', 'mexican']))).toBe(false);
  });

  it('requires all categories to match (AND logic)', () => {
    const recipe = makeRecipe({
      tags: ['one-pot', 'bread'],
      cuisine: 'italian',
      meal: 'lunch',
    });
    expect(
      matchCategory(recipe, new Set(['one-pot', 'bread', 'italian'])),
    ).toBe(true);
    expect(
      matchCategory(
        recipe,
        new Set(['one-pot', 'bread', 'italian', 'breakfast']),
      ),
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
    const recipe = makeRecipe({ meal: 'dinner', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', []);
    filterMap.set('language', []);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('matches recipe by meal filter', () => {
    const recipe = makeRecipe({ meal: 'breakfast' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', ['breakfast']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('matches recipe by language filter', () => {
    const recipe = makeRecipe({ language: 'ch' });
    const filterMap: FilterMap = new Map();
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns false when meal does not match', () => {
    const recipe = makeRecipe({ meal: 'dinner' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', ['breakfast']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });

  it('returns false when language does not match', () => {
    const recipe = makeRecipe({ language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });

  it('matches when filter has multiple values (OR within key)', () => {
    const recipe = makeRecipe({ meal: 'lunch' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', ['breakfast', 'lunch', 'dinner']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('requires all keys to match (AND logic across keys)', () => {
    const recipe = makeRecipe({ meal: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', ['breakfast']);
    filterMap.set('language', ['en']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns false when one of multiple keys does not match', () => {
    const recipe = makeRecipe({ meal: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', ['breakfast']);
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });

  it('skips keys with empty arrays and applies the rest', () => {
    const recipe = makeRecipe({ meal: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', []);
    filterMap.set('language', ['en']);
    expect(matchFilters(recipe, filterMap)).toBe(true);
  });

  it('returns false when non-empty key fails even if other keys are empty', () => {
    const recipe = makeRecipe({ meal: 'breakfast', language: 'en' });
    const filterMap: FilterMap = new Map();
    filterMap.set('meal', []);
    filterMap.set('language', ['ch']);
    expect(matchFilters(recipe, filterMap)).toBe(false);
  });
});

describe('controlled classifications', () => {
  it('finds meal and dish types without duplicating them in tags', () => {
    const recipe = makeRecipe({
      tags: [],
      meal: 'snack',
      type: ['bakery', 'side dish'],
    });
    expect(matchRecipe(recipe, 'SNACK')).toBe(true);
    expect(matchRecipe(recipe, 'bakery')).toBe(true);
    expect(matchCategory(recipe, new Set(['snack', 'side dish']))).toBe(true);
    expect(matchFilters(recipe, new Map([['type', ['soup', 'bakery']]]))).toBe(
      true,
    );
    expect(matchFilters(recipe, new Map([['type', ['soup']]]))).toBe(false);
  });

  it('matches controlled tags using OR within the field', () => {
    const recipe = makeRecipe({ tags: ['bread', 'dough'] });
    expect(matchFilters(recipe, new Map([['tags', ['cake', 'bread']]]))).toBe(
      true,
    );
    expect(matchFilters(recipe, new Map([['tags', ['cake']]]))).toBe(false);
  });

  it('keeps the cuisine hierarchy one-way', () => {
    const mexican = makeRecipe({ cuisine: 'mexican' });
    const regional = makeRecipe({ cuisine: 'latin-american' });
    expect(matchCategory(mexican, new Set(['latin-american']))).toBe(true);
    expect(
      matchFilters(mexican, new Map([['cuisine', ['latin-american']]])),
    ).toBe(true);
    expect(matchCategory(regional, new Set(['mexican']))).toBe(false);
    expect(matchFilters(regional, new Map([['cuisine', ['mexican']]]))).toBe(
      false,
    );
  });
});
