import { RecipeContent } from '@/components/RecipeContent';
import { getRecipe } from '@/api/recipes';

export default async function Page({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  const recipe = await getRecipe(recipeId);

  return <RecipeContent recipe={recipe} />;
}
