import { fetchRecipes } from '@/server/recipes';
import type { RecipeSearchParams } from '@/data/filter';
import { parseRecipeSearchParams } from '@/utils/searchParams';
import { RecipeDisplaySection } from '@/components/RecipeDisplaySection';

interface RecipeLoaderProps {
  searchParams: RecipeSearchParams;
}

export async function RecipeLoader({ searchParams }: RecipeLoaderProps) {
  const filters = parseRecipeSearchParams(searchParams);
  const initialPage = await fetchRecipes(filters);

  return (
    <RecipeDisplaySection initialPage={initialPage} urlFilters={filters} />
  );
}
