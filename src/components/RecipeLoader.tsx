import { Divider } from '@heroui/divider';
import { fetchRecipes } from '@/api/recipes';
import type { Recipe } from '@/data/recipe';
import { TopRecipes } from '@/components/TopRecipes';
import { RecipeDisplaySection } from '@/components/RecipeDisplaySection';

export async function RecipeLoader() {
  const recipeList: Recipe[] = await fetchRecipes();

  return (
    <>
      <TopRecipes topRecipes={recipeList} />
      <Divider />
      <RecipeDisplaySection recipeList={recipeList} />
    </>
  );
}
