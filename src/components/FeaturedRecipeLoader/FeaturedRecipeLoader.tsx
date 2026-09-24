import { fetchFeaturedRecipes } from '@/api/recipes';
import { TopRecipes } from '@/components/TopRecipes';

export async function FeaturedRecipeLoader() {
  const recipes = await fetchFeaturedRecipes();
  return <TopRecipes topRecipes={recipes} />;
}
