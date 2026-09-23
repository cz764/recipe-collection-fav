import type { Recipe } from './recipe';

export type FilterMap = Map<keyof Recipe, Array<string>>;

export type RecipeSearchParams = Record<string, string | string[] | undefined>;

export interface RecipeQuery {
  cuisine?: string;
  meal?: string;
  type?: string;
}
