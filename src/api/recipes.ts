import { matchCuisine, matchRecipe } from '@/utils/recipes';
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

export function fetchRecipes({
  cuisine,
  meal,
  type,
  q,
  tag,
}: RecipeQuery = {}) {
  const normalizedTag = tag?.trim().toLowerCase();
  const searchText = q?.trim();
  const normalizedCuisine = cuisine?.trim().toLowerCase();
  const normalizedMeal = meal?.trim().toLowerCase();
  const normalizedType = type?.trim().toLowerCase();

  return exampleRecipes.filter(
    (recipe) =>
      (!normalizedTag || recipe.tags.some((tag) => tag === normalizedTag)) &&
      (!searchText || matchRecipe(recipe, searchText)) &&
      (!normalizedCuisine || matchCuisine(recipe.cuisine, normalizedCuisine)) &&
      (!normalizedMeal || recipe.meal === normalizedMeal) &&
      (!normalizedType || recipe.type.some((type) => type === normalizedType)),
  );
}

export function getRecipe(id) {
  return exampleRecipes.find((e) => e.id === id);
}
