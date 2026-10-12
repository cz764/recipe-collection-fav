// Fails the build if any client component imports this module.
import 'server-only';
import { cache } from 'react';
import type { PostgrestError } from '@supabase/supabase-js';
import { getSupabaseClient } from './supabase';
import { toRecipe } from './recipeRow';
import { RECIPE_IMAGE_BUCKET, RECIPES_TABLE } from '@/constants/supabase';
import { ITEMS_PER_PAGE } from '@/constants';
import type { Recipe } from '@/data/recipe';
import type { RecipePage, RecipeQuery } from '@/data/filter';
import { filterRecipes, paginateRecipes } from '@/utils/recipes';
import { selectFeaturedRecipes } from '@/utils/featured';

const resolveImageUrl = (path: string): string => {
  if (/^https?:\/\//.test(path)) return path;
  return getSupabaseClient()
    .storage.from(RECIPE_IMAGE_BUCKET)
    .getPublicUrl(path).data.publicUrl;
};

const throwQueryError = (action: string, error: PostgrestError): never => {
  throw new Error(`Failed to ${action}: ${error.message}`);
};

/**
 * Loads the whole collection once per server request (React `cache`), so the
 * featured and results loaders share a single query. Filtering, search, and
 * paging run in Node on this list; see docs/decisions.md for the rationale.
 */
export const loadRecipes = cache(async (): Promise<Recipe[]> => {
  const { data, error } = await getSupabaseClient()
    .from(RECIPES_TABLE)
    .select('*')
    .order('created_at', { ascending: true });
  if (error) throwQueryError('load recipes', error);
  return (data ?? []).map((row) => toRecipe(row, resolveImageUrl));
});

/** Up to three recipes for the server's local calendar day, stable within that day. */
export async function fetchFeaturedRecipes(): Promise<Recipe[]> {
  return selectFeaturedRecipes(await loadRecipes(), new Date());
}

/** One page of recipes matching the URL filters, with the total match count. */
export async function fetchRecipes(
  filters: RecipeQuery = {},
  { page = 1 }: { page?: number } = {},
): Promise<RecipePage> {
  const matches = filterRecipes(await loadRecipes(), filters);
  return paginateRecipes(matches, page, ITEMS_PER_PAGE);
}

/** The recipe behind /details/<slug>, or undefined when no row has that slug. */
export async function getRecipeBySlug(
  slug: string,
): Promise<Recipe | undefined> {
  const { data, error } = await getSupabaseClient()
    .from(RECIPES_TABLE)
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error) throwQueryError('load recipe', error);
  return data ? toRecipe(data, resolveImageUrl) : undefined;
}
