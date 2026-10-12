import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Home from '../page';
import type { RecipeQuery, RecipeSearchParams } from '@/data/filter';

// Mock data lives here so the test owns the collection the loaders return.
const { featuredRender, mockRecipes } = await vi.hoisted(async () => {
  const { makeRecipe } = await import('@/components/__tests__/mockData');
  return {
    featuredRender: vi.fn(),
    mockRecipes: [
      makeRecipe({
        id: '1',
        name: 'Japanese Milk Bread',
        cuisine: 'japanese',
        meal: 'breakfast',
        type: ['bakery'],
        tags: ['bread', 'vegetarian'],
      }),
      makeRecipe({
        id: '2',
        name: 'Tomato Pasta',
        cuisine: 'italian',
        meal: 'dinner',
        type: ['entree'],
        tags: ['vegetarian', 'one-pot'],
      }),
      makeRecipe({
        id: '3',
        name: 'Pork Dumplings',
        cuisine: 'chinese',
        meal: 'lunch',
        type: ['appetizer'],
        tags: [],
      }),
      makeRecipe({
        id: '4',
        name: 'Cornbread',
        cuisine: 'mexican',
        meal: 'dinner',
        type: ['bakery', 'side dish'],
        tags: ['bread'],
      }),
    ],
  };
});

// Minimal stand-in for the data layer: only the filters this test exercises.
const selectMockRecipes = ({ q, type }: RecipeQuery) =>
  mockRecipes.filter(
    (recipe) =>
      (!type || recipe.type.some((item) => item === type)) &&
      (!q || recipe.name.toLowerCase().includes(q.toLowerCase())),
  );

// Resolve server data synchronously here so jsdom can test boundary reconciliation.
vi.mock('@/components/FeaturedRecipeLoader', async () => {
  const { TopRecipes } = await import('@/components/TopRecipes');
  return {
    FeaturedRecipeLoader: () => {
      featuredRender();
      return <TopRecipes topRecipes={mockRecipes.slice(0, 3)} />;
    },
  };
});
vi.mock('@/components/RecipeLoader', async () => {
  const { RecipeDisplaySection } = await import(
    '@/components/RecipeDisplaySection'
  );
  const { parseRecipeSearchParams } = await import('@/utils/searchParams');
  return {
    RecipeLoader: ({ searchParams }: { searchParams: RecipeSearchParams }) => {
      const filters = parseRecipeSearchParams(searchParams);
      return (
        <RecipeDisplaySection
          recipeList={selectMockRecipes(filters)}
          urlFilters={filters}
        />
      );
    },
  };
});

const allRecipesLabel = `${mockRecipes.length} recipes`;

describe('Home landing and results views', () => {
  beforeEach(() => featuredRender.mockClear());

  it('keeps featured recipes, search, and the full collection on the landing page', async () => {
    render(await Home({ searchParams: Promise.resolve({}) }));
    expect(screen.getByText("Today's recipe")).toBeVisible();
    expect(screen.getByLabelText('Search Input')).toBeVisible();
    expect(screen.getByText(allRecipesLabel)).toBeVisible();
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
    expect(screen.getByText(allRecipesLabel)).toBeVisible();
  });
});
