import { RecipeContent } from '@/components/RecipeContent';
import { getRecipe } from '@/api/recipes';

export default async function Page({
  params,
}: {
  params: Promise<{ recipeId: string }>;
}) {
  const { recipeId } = await params;
  let recipe;
  try {
    recipe = await getRecipe(recipeId);
  } catch (ex) {
    console.error(ex);
  }

  return recipe ? (
    <RecipeContent recipe={recipe} />
  ) : (
    <div>Something went wrong.</div>
  );
}
