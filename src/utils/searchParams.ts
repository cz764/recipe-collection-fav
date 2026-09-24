import type { RecipeQuery, RecipeSearchParams } from '@/data/filter';

export function parseRecipeSearchParams(
  params: RecipeSearchParams,
): RecipeQuery {
  const normalize = (value: string | string[] | undefined) => {
    // Cuisine, meal, and type are single-value filters; use the first repeated value.
    const firstValue = Array.isArray(value) ? value[0] : value;
    return firstValue?.trim().toLowerCase() || undefined;
  };

  return {
    q: (Array.isArray(params.q) ? params.q[0] : params.q)?.trim() || undefined,
    cuisine: normalize(params.cuisine),
    meal: normalize(params.meal),
    type: normalize(params.type),
  };
}

/** Use the same supported, normalized values as recipe filtering. */
export function hasRecipeFilters(params: RecipeSearchParams): boolean {
  return Object.values(parseRecipeSearchParams(params)).some(Boolean);
}
