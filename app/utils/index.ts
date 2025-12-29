import { Recipe } from '@/data/recipe';

export const randomRecipeIndexFromDate = (srcArrayLength: number): number => {
  const date = new Date();
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % srcArrayLength;
};

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
