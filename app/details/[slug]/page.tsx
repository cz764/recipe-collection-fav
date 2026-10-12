import { RecipeContent } from '@/components/RecipeContent';
import { getRecipeBySlug } from '@/server/recipes';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let recipe;
  try {
    recipe = await getRecipeBySlug(slug);
  } catch (ex) {
    console.error(ex);
  }

  return recipe ? (
    <RecipeContent recipe={recipe} />
  ) : (
    <div>Something went wrong.</div>
  );
}
