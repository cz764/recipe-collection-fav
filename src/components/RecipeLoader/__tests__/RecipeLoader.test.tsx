import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeLoader } from '..';
import { fetchRecipes } from '@/server/recipes';
import { makeRecipe } from '@/components/__tests__/mockData';
import type { RecipePage } from '@/data/filter';

vi.mock('@/server/recipes', () => ({ fetchRecipes: vi.fn() }));

const pageOf = (names: string[]): RecipePage => ({
  recipes: names.map((name, index) => makeRecipe({ id: `${index}`, name })),
  page: 1,
  pageSize: 12,
  total: names.length,
  hasMore: false,
});

describe('RecipeLoader', () => {
  beforeEach(() => vi.mocked(fetchRecipes).mockReset());

  it('passes normalized filters to the data layer and renders the page', async () => {
    vi.mocked(fetchRecipes).mockResolvedValue(pageOf(['Baozi', 'Borscht']));
    render(await RecipeLoader({ searchParams: { cuisine: ' Chinese ' } }));
    expect(fetchRecipes).toHaveBeenCalledWith(
      expect.objectContaining({ cuisine: 'chinese' }),
    );
    expect(screen.getByText('2 recipes')).toBeVisible();
    expect(screen.getByText('Baozi')).toBeVisible();
    expect(screen.getByText('Cuisine: Chinese')).toBeVisible();
  });

  it('shows the empty state when URL filters have no results', async () => {
    vi.mocked(fetchRecipes).mockResolvedValue(pageOf([]));
    render(await RecipeLoader({ searchParams: { type: 'unknown' } }));
    expect(screen.getByText('0 recipe')).toBeVisible();
    expect(screen.getByText('Type: Unknown')).toBeVisible();
    expect(screen.getByText('No recipes found.')).toBeVisible();
  });

  it('initializes search from a direct URL', async () => {
    vi.mocked(fetchRecipes).mockResolvedValue(pageOf(['Egg Bites']));
    render(
      await RecipeLoader({ searchParams: { q: ' Egg ', cuisine: 'modern' } }),
    );
    expect(fetchRecipes).toHaveBeenCalledWith(
      expect.objectContaining({ q: 'Egg', cuisine: 'modern' }),
    );
    expect(screen.getByLabelText('Search Input')).toHaveValue('Egg');
    expect(screen.getByText('Search: Egg')).toBeVisible();
    expect(screen.getByText('1 recipe')).toBeVisible();
  });
});
