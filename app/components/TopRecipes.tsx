import TodayRecipe from './RecipeCards/TodayRecipe';
import type { Recipe } from '@/data/recipe';

interface TopRecipesProps {
  topRecipes: Recipe[];
}

export default function TopRecipes({ topRecipes }: TopRecipesProps) {
  return (
    <div className='flex gap-8'>
      <TodayRecipe recipe={topRecipes[0]} />
      <div>Other inspiration</div>
    </div>
  );
}
