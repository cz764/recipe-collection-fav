import type {
  Cuisine,
  MealType,
  Recipe,
  RecipeTag,
  TypeCollection,
} from './recipe';

export type RecipeSearchParams = Record<string, string | string[] | undefined>;

/** Filters as they arrive from the URL: normalized strings, not yet validated. */
export interface RecipeQuery {
  q?: string;
  tag?: string;
  cuisine?: string;
  meal?: string;
  type?: string;
}

/**
 * A RecipeQuery whose vocabulary values are known members of the recipe enums.
 * Only these may be used to build database queries; see `validateRecipeQuery`.
 */
export interface RecipeFilters {
  q?: string;
  tag?: RecipeTag;
  cuisine?: Cuisine;
  meal?: MealType;
  type?: TypeCollection;
}

/** One page of filtered results plus what the client needs to ask for the next. */
export interface RecipePage {
  recipes: Recipe[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}
