import { Divider } from '@heroui/divider';
import { fetchRecipes } from '@/api/recipes';
import type { Recipe as RecipeType } from '@/data/recipe';
import TopRecipes from '@/components/TopRecipes';
import RecipeDisplaySection from '@/components/RecipeDisplaySection';

async function getRecipes() {
  const response = await fetchRecipes();
  return response;
}

export default async function Home() {
  const recipeList: RecipeType[] = await getRecipes();

  return (
    <div className='flex flex-col gap-4'>
      <TopRecipes topRecipes={recipeList} />
      <Divider />
      <RecipeDisplaySection recipeList={recipeList} />
    </div>
  );
}
