import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import type { RecipeSearchParams } from '@/data/filter';

const { featuredRender } = vi.hoisted(() => ({ featuredRender: vi.fn() }));

// Resolve server data synchronously here so jsdom can test boundary reconciliation.
vi.mock('@/components/FeaturedRecipeLoader', async () => {
  const { TopRecipes } = await import('@/components/TopRecipes');
  const { exampleRecipes } = await import('@/data/exampleRecipes');
  return {
    FeaturedRecipeLoader: () => {
      featuredRender();
      return <TopRecipes topRecipes={exampleRecipes.slice(0, 3)} />;
    },
  };
});
vi.mock('@/components/RecipeLoader', async () => {
  const { RecipeDisplaySection } = await import(
    '@/components/RecipeDisplaySection'
  );
  const { parseRecipeSearchParams } = await import('@/utils/searchParams');
  const { fetchRecipes } = await import('@/api/recipes');
  return {
    RecipeLoader: ({ searchParams }: { searchParams: RecipeSearchParams }) => {
      const filters = parseRecipeSearchParams(searchParams);
      return (
        <RecipeDisplaySection
          recipeList={fetchRecipes(filters)}
          urlFilters={filters}
        />
      );
    },
  };
});

describe('Home landing and results views', () => {
  beforeEach(() => featuredRender.mockClear());

  it('keeps featured recipes, search, and the full collection on the landing page', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText("Today's recipe")).toBeVisible();
    expect(screen.getByLabelText('Search Input')).toBeVisible();
    expect(screen.getByText('7 recipes')).toBeVisible();
    expect(featuredRender).toHaveBeenCalled();
  });

  it.each([
    { type: 'bakery' },
    { tag: 'vegetarian' },
    { q: 'Japanese' },
    { meal: 'breakfast' },
    { cuisine: 'chinese' },
    { type: 'invalid-type' },
  ])('does not mount the featured loader for %j', async (params) => {
    render(await Home({ searchParams: Promise.resolve(params) }));
    expect(featuredRender).not.toHaveBeenCalled();
    expect(screen.queryByText("Today's recipe")).not.toBeInTheDocument();
    expect(screen.getByLabelText('Search Input')).toBeVisible();
  });

  it.each([
    { q: '  ', type: '' },
    { campaign: 'newsletter' },
    { q: ['', 'egg'] },
  ])(
    'keeps featured recipes for blank or unrelated parameters %j',
    async (params) => {
      render(await Home({ searchParams: Promise.resolve(params) }));
      expect(screen.getByText("Today's recipe")).toBeVisible();
    },
  );

  it('moves between landing, narrowed Bakery results, empty results, and landing again', async () => {
    const { rerender } = render(
      await Home({ searchParams: Promise.resolve({}) }),
    );
    rerender(
      await Home({
        searchParams: Promise.resolve({ type: 'bakery', q: 'Japanese' }),
      }),
    );
    expect(screen.queryByText("Today's recipe")).not.toBeInTheDocument();
    expect(screen.getByText('Japanese Milk Bread')).toBeVisible();
    expect(screen.getByText('1 recipe')).toBeVisible();
    expect(screen.getByLabelText('Search Input')).toHaveValue('Japanese');
    rerender(
      await Home({ searchParams: Promise.resolve({ q: 'no-such-recipe' }) }),
    );
    expect(screen.getByText('No recipes found.')).toBeVisible();
    expect(screen.queryByText("Today's recipe")).not.toBeInTheDocument();
    rerender(await Home({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText("Today's recipe")).toBeVisible();
    expect(screen.getByLabelText('Search Input')).toHaveValue('');
    expect(screen.getByText('7 recipes')).toBeVisible();
  });
});
