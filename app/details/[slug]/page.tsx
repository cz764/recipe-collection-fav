import { notFound } from 'next/navigation';
import { RecipeContent } from '@/components/RecipeContent';
import { getRecipeBySlug } from '@/server/recipes';

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Query failures propagate to app/error.tsx; only a missing row is a 404.
  const recipe = await getRecipeBySlug(slug);
  if (!recipe) notFound();

  return <RecipeContent recipe={recipe} />;
}
