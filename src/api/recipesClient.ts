import type { RecipePage, RecipeQuery } from '@/data/filter';

export const RECIPES_API_PATH = '/api/recipes';

/** Query string for the recipes route: the active URL filters plus a page number. */
export function recipePageQuery(filters: RecipeQuery, page: number): string {
  const params = new URLSearchParams();
  for (const key of ['cuisine', 'meal', 'type', 'tag', 'q'] as const) {
    const value = filters[key];
    if (value) params.set(key, value);
  }
  params.set('page', String(page));
  return params.toString();
}

/** Browser-side fetch of one results page; used by infinite scroll and Load more. */
export async function fetchRecipePage(
  filters: RecipeQuery,
  page: number,
): Promise<RecipePage> {
  const response = await fetch(
    `${RECIPES_API_PATH}?${recipePageQuery(filters, page)}`,
  );
  if (!response.ok) {
    throw new Error(
      `Recipe page request failed with status ${response.status}`,
    );
  }
  return response.json();
}
