import { Divider } from '@heroui/divider';
import TopRecipes from '@/components/TopRecipes';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import { fetchRecipes } from '@/api/recipes';
import type { Recipe as RecipeType } from '@/data/recipe';
import RecipeCard from '@/components/RecipeCard';

export default function Home() {
  const recipeList: RecipeType[] = fetchRecipes();

  return (
    <div className='flex flex-col gap-4'>
      <TopRecipes topRecipes={recipeList} />
      <Divider />
      <SearchAndFilterBar />
      <div className='grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3'>
        {recipeList.map((recipeData) => {
          const { name } = recipeData;

          return <RecipeCard key={`${name}-card`} recipeData={recipeData} />;
        })}
      </div>
    </div>
  );
}
