import { afterEach, describe, expect, it, vi } from 'vitest';
import { fetchFeaturedRecipes, fetchRecipes } from '../recipes';
import { exampleRecipes } from '@/data/exampleRecipes';

describe('fetchFeaturedRecipes', () => {
  afterEach(() => vi.useRealTimers());

  it('returns three distinct recipes and keeps the selection stable for the day', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 10, 8));
    const morning = fetchFeaturedRecipes();
    expect(morning).toHaveLength(3);
    expect(new Set(morning.map((recipe) => recipe.id)).size).toBe(3);

    vi.setSystemTime(new Date(2026, 0, 10, 20));
    expect(fetchFeaturedRecipes()).toEqual(morning);

    vi.setSystemTime(new Date(2026, 0, 11, 8));
    expect(fetchFeaturedRecipes()).not.toEqual(morning);
  });
});

describe('fetchRecipes URL filters', () => {
  it('returns all recipes without filters', () => {
    expect(fetchRecipes()).toEqual(exampleRecipes);
  });

  it('matches cuisine exactly, ignoring case and surrounding spaces', () => {
    const recipes = fetchRecipes({ cuisine: ' CHINESE ' });
    expect(recipes.length).toBeGreaterThan(0);
    expect(recipes.every((recipe) => recipe.cuisine === 'chinese')).toBe(true);
    expect(fetchRecipes({ cuisine: 'chin' })).toEqual([]);
  });

  it('matches type and combines it with cuisine using AND', () => {
    const desserts = fetchRecipes({ meal: 'DESSERT' });
    expect(desserts.length).toBeGreaterThan(0);
    expect(desserts.every((recipe) => recipe.meal === 'dessert')).toBe(true);

    const recipe = exampleRecipes[0];
    expect(
      fetchRecipes({ cuisine: recipe.cuisine, meal: recipe.meal }),
    ).toContainEqual(recipe);
    expect(fetchRecipes({ cuisine: 'Chinese', meal: 'dessert' })).toEqual([]);
  });

  it('ignores blank filters and returns no matches for unknown values', () => {
    expect(fetchRecipes({ cuisine: ' ', meal: '' })).toEqual(exampleRecipes);
    expect(fetchRecipes({ cuisine: 'invalid-cuisine' })).toEqual([]);
    expect(fetchRecipes({ meal: 'unknown' })).toEqual([]);
  });
});

describe('recipe classifications', () => {
  it('matches any assigned dish type and combines cuisine, meal, and type', () => {
    const biscuits = exampleRecipes[1];
    expect(fetchRecipes({ type: ' BAKERY ' })).toContainEqual(biscuits);
    expect(fetchRecipes({ type: 'side dish' })).toContainEqual(biscuits);
    expect(
      fetchRecipes({ cuisine: 'mexican', meal: 'dinner', type: 'bakery' }),
    ).toEqual([biscuits]);
    expect(
      fetchRecipes({ cuisine: 'mexican', meal: 'breakfast', type: 'bakery' }),
    ).toEqual([]);
    expect(fetchRecipes({ type: 'breakfast' })).toEqual([]);
  });

  it('includes Mexican recipes in Latin American results', () => {
    const mexican = fetchRecipes({ cuisine: 'mexican' });
    expect(mexican.length).toBeGreaterThan(0);
    expect(fetchRecipes({ cuisine: 'latin-american' })).toEqual(
      expect.arrayContaining(mexican),
    );
  });

  it('treats unknown as a valid cuisine and excludes egg bites from Bakery', () => {
    expect(fetchRecipes({ cuisine: 'unknown' })).toContainEqual(
      exampleRecipes[0],
    );
    expect(fetchRecipes({ type: 'bakery' })).not.toContainEqual(
      exampleRecipes[5],
    );
  });
});

describe('URL text search', () => {
  it('searches case-insensitively and combines with classification filters', () => {
    const results = fetchRecipes({ q: ' EGG ' });
    expect(results).toContainEqual(exampleRecipes[5]);
    expect(results.length).toBeGreaterThan(0);
    const combined = fetchRecipes({
      q: 'EGG',
      cuisine: 'modern',
      meal: 'breakfast',
      type: 'entree',
    });
    expect(combined).toEqual([exampleRecipes[5]]);
    expect(fetchRecipes({ q: 'egg', cuisine: 'italian' })).toEqual([]);
  });
  it('ignores blank search and returns no results for unmatched text', () => {
    expect(fetchRecipes({ q: '  ' })).toEqual(exampleRecipes);
    expect(fetchRecipes({ q: 'no-such-recipe' })).toEqual([]);
  });
});
