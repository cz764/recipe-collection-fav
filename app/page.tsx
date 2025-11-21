import { Divider } from '@heroui/divider';
import TopRecipes from './components/TopRecipes';
import { fetchRecipes } from '@/api/recipes';
import type { Recipe } from '@/data/recipe';

export default function Home() {
  const recipeData: Recipe[] = fetchRecipes();

  return (
    <div className='flex flex-col'>
      <TopRecipes topRecipes={recipeData} />
      <Divider />
      <div>Filters</div>
      <div>Recipes display</div>
    </div>
  );
}
