import type { Recipe } from '@/data/recipe';

interface TodayRecipeProps {
  recipe: Recipe;
}

export default function TodayRecipe({ recipe }: TodayRecipeProps) {
  const { name } = recipe;
  return <div>Today's recipe: {name}</div>;
}
