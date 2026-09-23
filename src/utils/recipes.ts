import { Recipe } from '@/data/recipe';
import { everySet } from './generic';
import { FilterMap } from '@/data/filter';

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
 * Checks if a recipe matches all selected categories.
 * A recipe matches if its tags, cuisine, meal, and types contain all categories in the set.
 * @param recipe - The recipe to check
 * @param categorySet - Set of category keys to match against
 * @returns true if the recipe contains all selected categories
 */
export const matchCategory = (
  recipe: Recipe,
  categorySet: Set<string>,
): boolean => {
  const { tags, cuisine, meal, type } = recipe;
  const recipeInfo: string[] = [...tags, cuisine, meal, ...type];
  return everySet(
    categorySet,
    (category) =>
      recipeInfo.includes(category.toLowerCase()) ||
      matchCuisine(cuisine, category),
  );
};

/**
 * Checks if a recipe matches all filters.
 * Uses OR within each field and AND across fields.
 * @param recipe - The recipe to check
 * @param filterMap - Map of filter
 * @returns true if the recipe contains all selected categories
 */
export const matchFilters = (recipe: Recipe, filterMap: FilterMap): boolean => {
  for (const [key, filterValues] of filterMap) {
    if (filterValues.length === 0) continue;
    const value = recipe[key];
    const matches = filterValues.some((filter) => {
      if (key === 'cuisine') return matchCuisine(recipe.cuisine, filter);
      const values = Array.isArray(value) ? value : [value];
      return values.some(
        (item) =>
          typeof item === 'string' &&
          item.toLowerCase() === filter.toLowerCase(),
      );
    });
    if (!matches) return false;
  }
  return true;
};
