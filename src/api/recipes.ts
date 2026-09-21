import { exampleRecipes } from '@/data/exampleRecipes';
import type { RecipeQuery } from '@/data/filter';
import { randomRecipeIndexFromDate } from '@/utils/generic';

// Keep daily featured selection in the data layer for the future backend query.
export function fetchFeaturedRecipes() {
  if (exampleRecipes.length === 0) return [];

  const startIndex = randomRecipeIndexFromDate(exampleRecipes.length);
  return Array.from(
    { length: Math.min(3, exampleRecipes.length) },
    (_, offset) =>
      exampleRecipes[(startIndex + offset) % exampleRecipes.length],
  );
}

export function fetchRecipes({ cuisine, type }: RecipeQuery = {}) {
  const normalizedCuisine = cuisine?.trim().toLowerCase();
  const normalizedType = type?.trim().toLowerCase();

  return exampleRecipes.filter(
    (recipe) =>
      (!normalizedCuisine ||
        recipe.cuisine.toLowerCase() === normalizedCuisine) &&
      (!normalizedType || recipe.type.toLowerCase() === normalizedType),
  );
}

export function getRecipe(id) {
  return exampleRecipes.find((e) => e.id === id);
}
