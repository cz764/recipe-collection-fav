import type { Recipe } from './recipe';

export type FilterMap = Map<keyof Recipe, Array<string>>;

export type RecipeSearchParams = Record<string, string | string[] | undefined>;

export interface RecipeQuery {
  q?: string;
  tag?: string;
  cuisine?: string;
  meal?: string;
  type?: string;
}
