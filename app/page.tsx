import { Divider } from '@heroui/divider';
import TopRecipes from './components/TopRecipes';
import SearchAndFilterBar from './components/SearchAndFilterBar';
import { fetchRecipes } from '@/api/recipes';
import type { Recipe } from '@/data/recipe';

export default function Home() {
  const recipeData: Recipe[] = fetchRecipes();

  return (
    <div className='flex flex-col'>
      <TopRecipes topRecipes={recipeData} />
      <Divider />
      <SearchAndFilterBar />
      <div>Recipes display</div>
    </div>
  );
}
