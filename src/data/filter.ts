import type { Recipe } from './recipe';

export type RecipeSearchParams = Record<string, string | string[] | undefined>;

export interface RecipeQuery {
  q?: string;
  tag?: string;
  cuisine?: string;
  meal?: string;
  type?: string;
}

/** One page of filtered results plus what the client needs to ask for the next. */
export interface RecipePage {
  recipes: Recipe[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
