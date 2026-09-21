import { Divider } from '@heroui/divider';
import { fetchFeaturedRecipes, fetchRecipes } from '@/api/recipes';
import type { RecipeSearchParams } from '@/data/filter';
import { parseRecipeSearchParams } from '@/utils/searchParams';
import { TopRecipes } from '@/components/TopRecipes';
import { RecipeDisplaySection } from '@/components/RecipeDisplaySection';

interface RecipeLoaderProps {
  searchParams: RecipeSearchParams;
}

export async function RecipeLoader({ searchParams }: RecipeLoaderProps) {
  const filters = parseRecipeSearchParams(searchParams);
  const [featuredRecipes, recipeList] = await Promise.all([
    fetchFeaturedRecipes(),
    fetchRecipes(filters),
  ]);

  return (
    <>
      {featuredRecipes.length > 0 && (
        <TopRecipes topRecipes={featuredRecipes} />
      )}
      <Divider />
      <RecipeDisplaySection recipeList={recipeList} />
    </>
  );
}
