import { fetchRecipes } from '@/server/recipes';
import type { RecipeSearchParams } from '@/data/filter';
import { parseRecipeSearchParams } from '@/utils/searchParams';
import { parsePage } from '@/utils/recipes';

/** GET /api/recipes?cuisine=...&q=...&page=2 returns one page of filtered recipes. */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const params: RecipeSearchParams = {};
  // Preserve repeated values so the first-value rule matches the page loader.
  searchParams.forEach((_, key) => {
    params[key] = searchParams.getAll(key);
  });
  const filters = parseRecipeSearchParams(params);
  const page = parsePage(params.page?.[0]);

  try {
    return Response.json(await fetchRecipes(filters, { page }));
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Failed to load recipes.' }, { status: 500 });
  }
}
