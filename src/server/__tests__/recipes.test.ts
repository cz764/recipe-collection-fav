import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  fetchFeaturedRecipes,
  fetchRecipes,
  getRecipeBySlug,
} from '../recipes';
import { getSupabaseClient } from '../supabase';
import { ITEMS_PER_PAGE } from '@/constants';
import { RECIPE_IMAGE_BUCKET } from '@/constants/supabase';

vi.mock('../supabase', () => ({ getSupabaseClient: vi.fn() }));

const PUBLIC_BASE = `https://project.supabase.co/storage/v1/object/public/${RECIPE_IMAGE_BUCKET}`;

interface FakeRow {
  id: string;
  slug: string;
  name: string;
  description?: string;
  tags?: string[];
  source?: string;
  language?: string;
  total_time_minutes?: number;
  yield_servings?: number;
  equipments?: string[];
  cuisine?: string;
  meal?: string;
  type?: string[];
  ingredients?: unknown;
  picture_path?: string;
  prep?: string[];
  steps?: unknown;
  credit_to?: string | null;
  author_id?: string | null;
}

const makeRow = (overrides: Partial<FakeRow> & { id: string }): FakeRow => ({
  slug: `recipe-${overrides.id}`,
  name: `Recipe ${overrides.id}`,
  description: 'A test recipe',
  tags: [],
  source: 'https://example.com',
  language: 'en',
  total_time_minutes: 30,
  yield_servings: 4,
  equipments: ['oven'],
  cuisine: 'italian',
  meal: 'dinner',
  type: ['entree'],
  ingredients: [{ name: 'flour', amount: 100, unit: 'g' }],
  picture_path: `recipes/recipe-${overrides.id}.jpg`,
  prep: [],
  steps: [{ detail: 'Cook it.' }],
  credit_to: null,
  author_id: null,
  ...overrides,
});

interface QueryResult {
  data: unknown;
  error: { message: string; code?: string } | null;
}

/** Minimal stand-in for the supabase-js query builder used by the data layer. */
function installFakeClient(
  rows: FakeRow[],
  single: (slug: string) => QueryResult = (slug) => ({
    data: rows.find((row) => row.slug === slug) ?? null,
    error: null,
  }),
) {
  const builder = {
    select: () => builder,
    order: async () => ({ data: rows, error: null }),
    eq: (_column: string, slug: string) => ({
      maybeSingle: async () => single(slug),
    }),
  };
  vi.mocked(getSupabaseClient).mockReturnValue({
    from: () => builder,
    storage: {
      from: () => ({
        getPublicUrl: (path: string) => ({
          data: { publicUrl: `${PUBLIC_BASE}/${path}` },
        }),
      }),
    },
  } as unknown as ReturnType<typeof getSupabaseClient>);
}

const manyRows = (count: number) =>
  Array.from({ length: count }, (_, index) => makeRow({ id: `${index + 1}` }));

describe('fetchRecipes', () => {
  beforeEach(() => {
    vi.mocked(getSupabaseClient).mockClear();
    installFakeClient(manyRows(ITEMS_PER_PAGE + 2));
  });

  it('returns the first page with the total match count and more remaining', async () => {
    const page = await fetchRecipes();
    expect(page.recipes).toHaveLength(ITEMS_PER_PAGE);
    expect(page.page).toBe(1);
    expect(page.pageSize).toBe(ITEMS_PER_PAGE);
    expect(page.total).toBe(ITEMS_PER_PAGE + 2);
    expect(page.hasMore).toBe(true);
    expect(page.recipes[0].name).toBe('Recipe 1');
  });

  it('returns the remainder on the last page and treats invalid pages as page 1', async () => {
    const last = await fetchRecipes({}, { page: 2 });
    expect(last.recipes.map((recipe) => recipe.name)).toEqual([
      `Recipe ${ITEMS_PER_PAGE + 1}`,
      `Recipe ${ITEMS_PER_PAGE + 2}`,
    ]);
    expect(last.hasMore).toBe(false);
    expect((await fetchRecipes({}, { page: 0 })).page).toBe(1);
    expect((await fetchRecipes({}, { page: 9 })).recipes).toEqual([]);
  });

  it('applies URL filters before paging', async () => {
    installFakeClient([
      makeRow({ id: '1', cuisine: 'chinese' }),
      makeRow({ id: '2', cuisine: 'italian' }),
      makeRow({ id: '3', cuisine: 'mexican' }),
    ]);
    const chinese = await fetchRecipes({ cuisine: ' CHINESE ' });
    expect(chinese.recipes.map((recipe) => recipe.id)).toEqual(['1']);
    expect(chinese.total).toBe(1);
    expect(chinese.hasMore).toBe(false);
    expect((await fetchRecipes({ cuisine: 'latin-american' })).total).toBe(1);
  });

  it('returns an empty page for unknown vocabulary values without querying', async () => {
    const page = await fetchRecipes({ cuisine: 'invalid', meal: 'dinner' });
    expect(page).toEqual({
      recipes: [],
      page: 1,
      pageSize: ITEMS_PER_PAGE,
      total: 0,
      hasMore: false,
    });
    expect(getSupabaseClient).not.toHaveBeenCalled();
    expect((await fetchRecipes({ tag: 'spicy' }, { page: 3 })).page).toBe(3);
  });

  it('maps rows into recipes with public image URLs', async () => {
    installFakeClient([
      makeRow({
        id: '1',
        picture_path: 'recipes/bread.jpg',
        steps: [
          { detail: 'Mix', image_path: 'recipes/bread-step-1.jpg' },
          { detail: 'Bake', image_path: null },
        ],
        credit_to: 'A baker',
      }),
      makeRow({ id: '2', picture_path: 'https://cdn.example.com/x.png' }),
    ]);
    const { recipes } = await fetchRecipes();
    expect(recipes[0].pictureUrl).toBe(`${PUBLIC_BASE}/recipes/bread.jpg`);
    expect(recipes[0].steps.steps).toEqual([
      { detail: 'Mix', imageUrl: `${PUBLIC_BASE}/recipes/bread-step-1.jpg` },
      { detail: 'Bake' },
    ]);
    expect(recipes[0].totalTime).toBe(30);
    expect(recipes[0].creditTo).toBe('A baker');
    expect(recipes[0]).not.toHaveProperty('authorId');
    expect(recipes[1].pictureUrl).toBe('https://cdn.example.com/x.png');
  });

  it('rejects rows outside the recipe vocabulary or shape', async () => {
    installFakeClient([makeRow({ id: '1', cuisine: 'martian' })]);
    await expect(fetchRecipes()).rejects.toThrow(
      'Invalid recipe row 1: unknown cuisine',
    );
    installFakeClient([makeRow({ id: '2', ingredients: [{ amount: 1 }] })]);
    await expect(fetchRecipes()).rejects.toThrow('malformed ingredient');
    installFakeClient([makeRow({ id: '3', type: [] })]);
    await expect(fetchRecipes()).rejects.toThrow('non-empty array');
    installFakeClient([{ ...makeRow({ id: '4' }), slug: undefined }]);
    await expect(fetchRecipes()).rejects.toThrow('slug must be a string');
  });

  it('surfaces query errors', async () => {
    vi.mocked(getSupabaseClient).mockReturnValue({
      from: () => ({
        select: () => ({
          order: async () => ({
            data: null,
            error: { message: 'connection refused' },
          }),
        }),
      }),
    } as unknown as ReturnType<typeof getSupabaseClient>);
    await expect(fetchRecipes()).rejects.toThrow(
      'Failed to load recipes: connection refused',
    );
  });
});

describe('fetchFeaturedRecipes', () => {
  beforeEach(() => installFakeClient(manyRows(8)));
  afterEach(() => vi.useRealTimers());

  it('returns three distinct recipes and keeps the selection stable for the day', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 0, 10, 0, 15));
    const morning = await fetchFeaturedRecipes();
    expect(morning).toHaveLength(3);
    expect(new Set(morning.map((recipe) => recipe.id)).size).toBe(3);

    vi.setSystemTime(new Date(2026, 0, 10, 23, 45));
    expect(await fetchFeaturedRecipes()).toEqual(morning);

    vi.setSystemTime(new Date(2026, 0, 11, 8));
    expect(await fetchFeaturedRecipes()).not.toEqual(morning);
  });

  it('returns the whole collection when it holds fewer than three recipes', async () => {
    installFakeClient(manyRows(2));
    expect(await fetchFeaturedRecipes()).toHaveLength(2);
  });
});

describe('getRecipeBySlug', () => {
  it('returns the mapped recipe for a known slug and undefined otherwise', async () => {
    installFakeClient([
      makeRow({ id: 'a', slug: 'milk-bread', name: 'Milk Bread' }),
    ]);
    const recipe = await getRecipeBySlug('milk-bread');
    expect(recipe?.name).toBe('Milk Bread');
    expect(recipe?.slug).toBe('milk-bread');
    expect(await getRecipeBySlug('no-such-recipe')).toBeUndefined();
  });

  it('surfaces query errors', async () => {
    installFakeClient([], () => ({
      data: null,
      error: { message: 'permission denied', code: '42501' },
    }));
    await expect(getRecipeBySlug('x')).rejects.toThrow(
      'Failed to load recipe: permission denied',
    );
  });
});
