import TodayRecipe from './RecipeCards/TodayRecipe';
import type { Recipe } from '@/data/recipe';
import RecipeEW from './RecipeCards/RecipeEW';

interface TopRecipesProps {
  topRecipes: Recipe[];
}

export default function TopRecipes({ topRecipes }: TopRecipesProps) {
  const otherRecipes = topRecipes.slice(-2);
  return (
    <div className='mb-4 flex gap-8'>
      <TodayRecipe recipe={topRecipes[0]} />
      <div className='flex flex-col gap-8'>
        {otherRecipes.map((recipe) => (
          <RecipeEW key={`other-recipe-${recipe.id}`} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
