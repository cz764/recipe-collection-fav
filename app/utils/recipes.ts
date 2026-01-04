import { Recipe } from '@/data/recipe';
import { everySet } from './generic';

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
 * A recipe matches if its tags, cuisine, and type contain all categories in the set.
 * @param recipe - The recipe to check
 * @param categorySet - Set of category keys to match against
 * @returns true if the recipe contains all selected categories
 */
export const matchCategory = (recipe: Recipe, categorySet: Set<string>) => {
  const { tags, cuisine, type } = recipe;
  const recipeInfo = [...tags, cuisine, type];
  return everySet(categorySet, (category) => recipeInfo.includes(category));
};
