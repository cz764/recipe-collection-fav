import { Recipe } from '@/data/recipe';
import type { RecipePage, RecipeQuery } from '@/data/filter';

export const matchCuisine = (
  cuisine: Recipe['cuisine'],
  value: string,
): boolean =>
  cuisine === value.trim().toLowerCase() ||
  (value.trim().toLowerCase() === 'latin-american' && cuisine === 'mexican');

/**
 * Checks if a recipe matches the search text.
 * Performs partial matching on name, description, and cuisine.
 * Performs full string matching on tags, ingredients, and equipments.
 * All matching is case-insensitive.
 * @param recipe - The recipe to check
 * @param searchText - The search text to match against
 * @returns true if the recipe matches the search text
 */
export const matchRecipe = (recipe: Recipe, searchText: string): boolean => {
  const lowerSearch = searchText.toLowerCase();
  const { name, description, cuisine, tags, ingredients, equipments } = recipe;

  // Todo: maybe change to full string match when there's more recipes
  if (name.toLowerCase().includes(lowerSearch)) {
    return true;
  }
  if (description.toLowerCase().includes(lowerSearch)) {
    return true;
  }
  if (cuisine.toLowerCase().includes(lowerSearch)) {
    return true;
  }
  if (
    recipe.meal === lowerSearch ||
    recipe.type.some((type) => type === lowerSearch) ||
    matchCuisine(cuisine, lowerSearch)
  )
    return true;
  // tag, ingredient, and equipments are full string match
  if (tags.map((tag) => tag.toLowerCase()).includes(lowerSearch)) {
    return true;
  }
  if (
    ingredients
      .map((ingredient) => ingredient.name.toLowerCase())
      .includes(lowerSearch)
  ) {
    return true;
  }
  if (equipments.map((equip) => equip.toLowerCase()).includes(lowerSearch)) {
    return true;
  }

  return false;
};

/**
 * Applies URL filters to a recipe list: fields combine with AND, values are
 * trimmed and matched case-insensitively, and blank values are ignored.
 */
export const filterRecipes = (
  recipes: readonly Recipe[],
  { cuisine, meal, type, q, tag }: RecipeQuery = {},
): Recipe[] => {
  const normalizedTag = tag?.trim().toLowerCase();
  const searchText = q?.trim();
  const normalizedCuisine = cuisine?.trim().toLowerCase();
  const normalizedMeal = meal?.trim().toLowerCase();
  const normalizedType = type?.trim().toLowerCase();

  return recipes.filter(
    (recipe) =>
      (!normalizedTag || recipe.tags.some((tag) => tag === normalizedTag)) &&
      (!searchText || matchRecipe(recipe, searchText)) &&
      (!normalizedCuisine || matchCuisine(recipe.cuisine, normalizedCuisine)) &&
      (!normalizedMeal || recipe.meal === normalizedMeal) &&
      (!normalizedType || recipe.type.some((type) => type === normalizedType)),
  );
};

/** Parses a 1-based page number from a query value; anything invalid becomes page 1. */
export const parsePage = (value: string | undefined): number => {
  const page = Number(value);
  return Number.isInteger(page) && page > 0 ? page : 1;
};

/** Slices one page out of an already filtered list and reports whether more remain. */
export const paginateRecipes = (
  recipes: readonly Recipe[],
  page: number,
  pageSize: number,
): RecipePage => {
  const safePage = parsePage(String(page));
  const start = (safePage - 1) * pageSize;
  const items = recipes.slice(start, start + pageSize);
  return {
    recipes: items,
    page: safePage,
    pageSize,
    total: recipes.length,
    hasMore: start + items.length < recipes.length,
  };
};
