import {
  CUISINES,
  MEAL_TYPES,
  RECIPE_TAGS,
  TYPE_COLLECTIONS,
} from '@/constants/recipe';
import type { Ingredient, Recipe, Step } from '@/data/recipe';

/** Shape of a row in the recipes table. Columns are snake_case. */
export interface RecipeRow {
  id: string;
  slug: string;
  name: string;
  description: string;
  tags: string[];
  source: string;
  language: string;
  total_time_minutes: number;
  yield_servings: number;
  equipments: string[];
  cuisine: string;
  meal: string;
  type: string[];
  ingredients: unknown;
  picture_path: string;
  prep: string[];
  steps: unknown;
  credit_to: string | null;
  author_id: string | null;
}

export class RecipeRowError extends Error {
  constructor(id: string, detail: string) {
    super(`Invalid recipe row ${id}: ${detail}`);
    this.name = 'RecipeRowError';
  }
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value);

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === 'string');

const isOneOf = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === 'string' && values.includes(value as T);

const LANGUAGES = ['en', 'ch'] as const;

const parseIngredient = (value: unknown): Ingredient | undefined => {
  if (!isRecord(value)) return undefined;
  const { name, amount, unit } = value;
  if (typeof name !== 'string') return undefined;
  if (typeof amount !== 'number' && typeof amount !== 'string') {
    return undefined;
  }
  if (unit != null && typeof unit !== 'string') return undefined;
  return typeof unit === 'string' && unit
    ? { name, amount, unit }
    : { name, amount };
};

/**
 * Validates a database row and converts it into the frontend Recipe shape.
 * Image paths are resolved through `resolveImageUrl`, which turns bucket
 * object paths into public URLs and passes absolute URLs through unchanged.
 */
export function toRecipe(
  row: unknown,
  resolveImageUrl: (path: string) => string,
): Recipe {
  if (!isRecord(row) || typeof row.id !== 'string') {
    throw new RecipeRowError('unknown', 'row is not an object with an id');
  }
  const { id } = row;
  const fail = (detail: string): never => {
    throw new RecipeRowError(id, detail);
  };

  const requireString = (key: keyof RecipeRow): string =>
    typeof row[key] === 'string'
      ? (row[key] as string)
      : fail(`${key} must be a string`);
  const requireStringArray = (key: keyof RecipeRow): string[] =>
    isStringArray(row[key])
      ? (row[key] as string[])
      : fail(`${key} must be a string array`);
  const requireNumber = (key: keyof RecipeRow): number =>
    typeof row[key] === 'number'
      ? (row[key] as number)
      : fail(`${key} must be a number`);
  const requireOneOf = <T extends string>(
    values: readonly T[],
    key: keyof RecipeRow,
  ): T => {
    const value = row[key];
    return isOneOf(values, value) ? value : fail(`unknown ${key}`);
  };

  const cuisine = requireOneOf(CUISINES, 'cuisine');
  const meal = requireOneOf(MEAL_TYPES, 'meal');
  const language = requireOneOf(LANGUAGES, 'language');

  const type = requireStringArray('type');
  if (
    type.length === 0 ||
    !type.every((item) => isOneOf(TYPE_COLLECTIONS, item))
  ) {
    fail('type must be a non-empty array of dish types');
  }
  const tags = requireStringArray('tags');
  if (!tags.every((item) => isOneOf(RECIPE_TAGS, item))) fail('unknown tag');

  if (!Array.isArray(row.ingredients)) fail('ingredients must be an array');
  const ingredients = (row.ingredients as unknown[]).map(
    (item) => parseIngredient(item) ?? fail('malformed ingredient'),
  );

  if (!Array.isArray(row.steps)) fail('steps must be an array');
  const steps: Step[] = (row.steps as unknown[]).map((item) => {
    if (!isRecord(item) || typeof item.detail !== 'string') {
      return fail('malformed step');
    }
    const imagePath = item.image_path;
    if (typeof imagePath === 'string' && imagePath) {
      return { detail: item.detail, imageUrl: resolveImageUrl(imagePath) };
    }
    return { detail: item.detail };
  });

  const creditTo = row.credit_to;
  const authorId = row.author_id;

  return {
    id,
    slug: requireString('slug'),
    name: requireString('name'),
    description: requireString('description'),
    tags: tags as Recipe['tags'],
    source: requireString('source'),
    language,
    totalTime: requireNumber('total_time_minutes'),
    yieldServings: requireNumber('yield_servings'),
    equipments: requireStringArray('equipments'),
    cuisine,
    meal,
    type: type as Recipe['type'],
    ingredients,
    pictureUrl: resolveImageUrl(requireString('picture_path')),
    steps: { prep: requireStringArray('prep'), steps },
    ...(typeof creditTo === 'string' ? { creditTo } : {}),
    ...(typeof authorId === 'string' ? { authorId } : {}),
  };
}
