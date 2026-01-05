import type { Recipe } from './recipe';

export type FilterMap = Map<keyof Recipe, Array<string>>;
