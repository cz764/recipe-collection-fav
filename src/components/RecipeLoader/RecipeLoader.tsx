import { fetchRecipes } from '@/api/recipes';
import type { RecipeSearchParams } from '@/data/filter';
import { parseRecipeSearchParams } from '@/utils/searchParams';
import { RecipeDisplaySection } from '@/components/RecipeDisplaySection';

interface RecipeLoaderProps {
  searchParams: RecipeSearchParams;
}

export async function RecipeLoader({ searchParams }: RecipeLoaderProps) {
  const filters = parseRecipeSearchParams(searchParams);
  const recipeList = await fetchRecipes(filters);

  return <RecipeDisplaySection recipeList={recipeList} urlFilters={filters} />;
}
