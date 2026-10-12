import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GET } from '../route';
import { fetchRecipes } from '@/server/recipes';
import type { RecipePage } from '@/data/filter';

vi.mock('@/server/recipes', () => ({ fetchRecipes: vi.fn() }));

const emptyPage: RecipePage = {
  recipes: [],
  page: 2,
  pageSize: 12,
  total: 0,
  hasMore: false,
};

describe('GET /api/recipes', () => {
  beforeEach(() => {
    vi.mocked(fetchRecipes).mockReset();
    vi.mocked(fetchRecipes).mockResolvedValue(emptyPage);
  });

  it('parses filters with the first-value rule and the page number', async () => {
    const response = await GET(
      new Request(
        'http://localhost/api/recipes?cuisine=Chinese&cuisine=italian&q=%20Egg%20&page=2&extra=ignored',
      ),
    );
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual(emptyPage);
    expect(fetchRecipes).toHaveBeenCalledWith(
      {
        q: 'Egg',
        tag: undefined,
        cuisine: 'chinese',
        meal: undefined,
        type: undefined,
      },
      { page: 2 },
    );
  });

  it('falls back to page 1 for missing or invalid page values', async () => {
    await GET(new Request('http://localhost/api/recipes'));
    await GET(new Request('http://localhost/api/recipes?page=abc'));
    await GET(new Request('http://localhost/api/recipes?page=-3'));
    expect(
      vi.mocked(fetchRecipes).mock.calls.map(([, options]) => options),
    ).toEqual([{ page: 1 }, { page: 1 }, { page: 1 }]);
  });

  it('returns a 500 JSON error when the data layer fails', async () => {
    vi.mocked(fetchRecipes).mockRejectedValue(new Error('boom'));
    const consoleError = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const response = await GET(new Request('http://localhost/api/recipes'));
    expect(response.status).toBe(500);
    expect(await response.json()).toEqual({ error: 'Failed to load recipes.' });
    consoleError.mockRestore();
  });
});
