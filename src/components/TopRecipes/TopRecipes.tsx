'use client';

import { TodayRecipe } from './TodayRecipe';
import type { Recipe } from '@/data/recipe';
import { RecipeEW } from './RecipeEW';

interface TopRecipesProps {
  topRecipes: Recipe[];
}

export function TopRecipes({ topRecipes }: TopRecipesProps) {
  const [todayRecipe, ...otherRecipes] = topRecipes;
  if (!todayRecipe) return null;

  return (
    <div className='flex flex-col place-content-center gap-2 md:gap-6 xl:flex-row'>
      <TodayRecipe recipe={todayRecipe} />
      <div className='flex min-w-0 flex-1 flex-col gap-8'>
        {otherRecipes.map((recipe) => (
          <RecipeEW key={`other-recipe-${recipe.id}`} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
