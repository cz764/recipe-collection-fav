'use client';

import { TodayRecipe } from './TodayRecipe';
import type { Recipe } from '@/data/recipe';
import { RecipeEW } from './RecipeEW';
import { randomRecipeIndexFromDate } from '@/utils';

interface TopRecipesProps {
  topRecipes: Recipe[];
}

export function TopRecipes({ topRecipes }: TopRecipesProps) {
  const todayRecipeIndex = randomRecipeIndexFromDate(topRecipes.length);
  const otherRecipes = [
    topRecipes[(todayRecipeIndex + 1) % topRecipes.length],
    topRecipes[(todayRecipeIndex + 2) % topRecipes.length],
  ];

  return (
    <div className='flex flex-col place-content-center gap-2 md:gap-6 lg:flex-row'>
      <TodayRecipe recipe={topRecipes[todayRecipeIndex]} />
      <div className='flex flex-col gap-8'>
        {otherRecipes.map((recipe) => (
          <RecipeEW key={`other-recipe-${recipe.id}`} recipe={recipe} />
        ))}
      </div>
    </div>
  );
}
