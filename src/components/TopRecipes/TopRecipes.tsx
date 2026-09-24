'use client';

import { Divider } from '@heroui/divider';
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
    <section
      className='flex flex-col gap-4'
      aria-labelledby='featured-recipes-heading'
    >
      <h1 id='featured-recipes-heading' className='text-center text-2xl'>
        Today's recipe
      </h1>
      <Divider />
      <div className='flex flex-col place-content-center gap-2 md:gap-6 xl:flex-row'>
        <TodayRecipe recipe={todayRecipe} />
        <div className='flex min-w-0 flex-1 flex-col gap-8'>
          {otherRecipes.map((recipe) => (
            <RecipeEW key={`other-recipe-${recipe.id}`} recipe={recipe} />
          ))}
        </div>
      </div>
    </section>
  );
}
