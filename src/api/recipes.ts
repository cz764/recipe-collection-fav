import { exampleRecipes } from '@/data/exampleRecipes';

export function fetchRecipes() {
  return exampleRecipes;
}

export function getRecipe(id) {
  return exampleRecipes.find((e) => e.id === id);
}
