import { describe, it, expect } from 'vitest';
import {
  filterRecipes,
  matchCuisine,
  matchRecipe,
  paginateRecipes,
  parsePage,
  validateRecipeQuery,
} from '../index';
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

describe('controlled classifications', () => {
  it('finds meal and dish types without duplicating them in tags', () => {
    const recipe = makeRecipe({
      tags: [],
      meal: 'snack',
      type: ['bakery', 'side dish'],
    });
    expect(matchRecipe(recipe, 'SNACK')).toBe(true);
    expect(matchRecipe(recipe, 'bakery')).toBe(true);
  });

  it('keeps the cuisine hierarchy one-way', () => {
    expect(matchCuisine('mexican', 'latin-american')).toBe(true);
    expect(matchCuisine('latin-american', 'mexican')).toBe(false);
    expect(matchCuisine('mexican', ' Mexican ')).toBe(true);
  });
});

describe('filterRecipes', () => {
  const sourdough = makeRecipe({
    id: '1',
    name: 'Sourdough',
    cuisine: 'unknown',
    meal: 'breakfast',
    type: ['bakery'],
    tags: ['vegetarian', 'bread'],
  });
  const biscuits = makeRecipe({
    id: '2',
    name: 'Cornbread Biscuits',
    cuisine: 'mexican',
    meal: 'dinner',
    type: ['bakery', 'side dish'],
    tags: ['bread'],
  });
  const eggBites = makeRecipe({
    id: '3',
    name: 'Egg Bites',
    cuisine: 'modern',
    meal: 'breakfast',
    type: ['entree'],
    tags: ['high-protein'],
    ingredients: [{ name: 'egg', amount: 6 }],
  });
  const dumplings = makeRecipe({
    id: '4',
    name: 'Baozi',
    cuisine: 'chinese',
    meal: 'lunch',
    type: ['appetizer', 'entree'],
    tags: ['dough'],
  });
  const all = [sourdough, biscuits, eggBites, dumplings];
  const names = (filters: Parameters<typeof filterRecipes>[1]) =>
    filterRecipes(all, filters).map((recipe) => recipe.name);

  it('returns everything for missing or blank filters', () => {
    expect(filterRecipes(all)).toEqual(all);
    expect(
      filterRecipes(all, { cuisine: ' ', meal: '', q: '  ', tag: ' ' }),
    ).toEqual(all);
  });

  it('matches cuisine exactly, ignoring case and spaces, with Mexican inside Latin American', () => {
    expect(names({ cuisine: ' CHINESE ' })).toEqual(['Baozi']);
    expect(names({ cuisine: 'chin' })).toEqual([]);
    expect(names({ cuisine: 'latin-american' })).toEqual([
      'Cornbread Biscuits',
    ]);
    expect(names({ cuisine: 'unknown' })).toEqual(['Sourdough']);
    expect(names({ cuisine: 'invalid-cuisine' })).toEqual([]);
  });

  it('matches meal, any assigned dish type, and exact tags', () => {
    expect(names({ meal: 'DESSERT' })).toEqual([]);
    expect(names({ meal: 'breakfast' })).toEqual(['Sourdough', 'Egg Bites']);
    expect(names({ type: ' BAKERY ' })).toEqual([
      'Sourdough',
      'Cornbread Biscuits',
    ]);
    expect(names({ type: 'side dish' })).toEqual(['Cornbread Biscuits']);
    expect(names({ type: 'breakfast' })).toEqual([]);
    expect(names({ tag: ' VEGETARIAN ' })).toEqual(['Sourdough']);
    expect(names({ tag: 'veg' })).toEqual([]);
  });

  it('combines fields with AND and searches text case-insensitively', () => {
    expect(
      names({ cuisine: 'mexican', meal: 'dinner', type: 'bakery' }),
    ).toEqual(['Cornbread Biscuits']);
    expect(names({ cuisine: 'mexican', meal: 'breakfast' })).toEqual([]);
    expect(names({ q: ' EGG ' })).toEqual(['Egg Bites']);
    expect(
      names({ q: 'egg', cuisine: 'modern', meal: 'breakfast', type: 'entree' }),
    ).toEqual(['Egg Bites']);
    expect(names({ q: 'egg', cuisine: 'italian' })).toEqual([]);
    expect(names({ tag: 'bread', type: 'bakery', q: 'Sour' })).toEqual([
      'Sourdough',
    ]);
    expect(names({ q: 'no-such-recipe' })).toEqual([]);
  });
});

describe('parsePage and paginateRecipes', () => {
  const recipes = Array.from({ length: 7 }, (_, index) =>
    makeRecipe({ id: `${index + 1}`, name: `Recipe ${index + 1}` }),
  );

  it('accepts positive integers and falls back to page 1', () => {
    expect(parsePage('3')).toBe(3);
    expect(parsePage(undefined)).toBe(1);
    expect(parsePage('0')).toBe(1);
    expect(parsePage('-2')).toBe(1);
    expect(parsePage('1.5')).toBe(1);
    expect(parsePage('abc')).toBe(1);
  });

  it('slices pages and reports the total and whether more remain', () => {
    const first = paginateRecipes(recipes, 1, 3);
    expect(first.recipes.map((recipe) => recipe.name)).toEqual([
      'Recipe 1',
      'Recipe 2',
      'Recipe 3',
    ]);
    expect(first).toMatchObject({
      page: 1,
      pageSize: 3,
      total: 7,
      hasMore: true,
    });

    const last = paginateRecipes(recipes, 3, 3);
    expect(last.recipes.map((recipe) => recipe.name)).toEqual(['Recipe 7']);
    expect(last.hasMore).toBe(false);

    expect(paginateRecipes(recipes, 4, 3)).toMatchObject({
      recipes: [],
      total: 7,
      hasMore: false,
    });
    expect(paginateRecipes([], 1, 3)).toMatchObject({
      total: 0,
      hasMore: false,
    });
    expect(paginateRecipes(recipes, 0, 3).page).toBe(1);
  });
});

describe('validateRecipeQuery', () => {
  it('accepts normalized vocabulary values and keeps search text as typed', () => {
    expect(
      validateRecipeQuery({
        cuisine: ' Latin-American ',
        meal: 'DINNER',
        type: 'side dish',
        tag: 'one-pot',
        q: ' Egg & Cheese ',
      }),
    ).toEqual({
      cuisine: 'latin-american',
      meal: 'dinner',
      type: 'side dish',
      tag: 'one-pot',
      q: 'Egg & Cheese',
    });
  });

  it('drops blank values and returns an empty filter set for no filters', () => {
    expect(validateRecipeQuery({})).toEqual({});
    expect(validateRecipeQuery({ cuisine: ' ', q: '  ', tag: '' })).toEqual({});
  });

  it.each([
    { cuisine: 'martian' },
    { meal: 'brunch' },
    { type: 'drink' },
    { tag: 'spicy' },
    { cuisine: 'chinese', tag: 'spicy' },
  ])('rejects %o so it never reaches the database', (query) => {
    expect(validateRecipeQuery(query)).toBeUndefined();
  });
});
