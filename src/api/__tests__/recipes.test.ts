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
    expect(recipes.every((recipe) => recipe.cuisine === 'Chinese')).toBe(true);
    expect(fetchRecipes({ cuisine: 'chin' })).toEqual([]);
  });

  it('matches type and combines it with cuisine using AND', () => {
    const desserts = fetchRecipes({ type: 'DESSERT' });
    expect(desserts.length).toBeGreaterThan(0);
    expect(desserts.every((recipe) => recipe.type === 'dessert')).toBe(true);

    const recipe = exampleRecipes[0];
    expect(
      fetchRecipes({ cuisine: recipe.cuisine, type: recipe.type }),
    ).toContainEqual(recipe);
    expect(fetchRecipes({ cuisine: 'Chinese', type: 'dessert' })).toEqual([]);
  });

  it('ignores blank filters and returns no matches for unknown values', () => {
    expect(fetchRecipes({ cuisine: ' ', type: '' })).toEqual(exampleRecipes);
    expect(fetchRecipes({ cuisine: 'unknown' })).toEqual([]);
    expect(fetchRecipes({ type: 'unknown' })).toEqual([]);
  });
});
