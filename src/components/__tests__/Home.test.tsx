import { describe, expect, it, vi } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Home from '../../../app/page';
import type { RecipeSearchParams } from '@/data/filter';

// Resolve server data synchronously here so jsdom can test boundary reconciliation.
vi.mock('@/components/FeaturedRecipeLoader', async () => {
  const { TopRecipes } = await import('@/components/TopRecipes');
  const { exampleRecipes } = await import('@/data/exampleRecipes');
  return {
    FeaturedRecipeLoader: () => (
      <TopRecipes topRecipes={exampleRecipes.slice(0, 3)} />
    ),
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

describe('Home navigation boundaries', () => {
  it('preserves pending and loaded featured images while replacing filtered results', async () => {
    const { rerender } = render(
      await Home({ searchParams: Promise.resolve({}) }),
    );
    const image = screen.getAllByAltText(
      'Mexican Cheese Cornbread Biscuits-image',
    )[0] as HTMLImageElement;
    image.parentElement!.style.position = 'relative';
    Object.defineProperty(image, 'height', { value: 120 });
    expect(image.parentElement).toHaveAttribute('data-loading', 'true');

    rerender(
      await Home({ searchParams: Promise.resolve({ meal: 'breakfast' }) }),
    );
    expect(screen.getByAltText('Mexican Cheese Cornbread Biscuits-image')).toBe(
      image,
    );
    expect(image.parentElement).toHaveAttribute('data-loading', 'true');
    expect(screen.getByText('meal: breakfast')).toBeVisible();

    fireEvent.load(image);
    await waitFor(() =>
      expect(image.parentElement).toHaveAttribute('data-loading', 'false'),
    );
    rerender(
      await Home({ searchParams: Promise.resolve({ meal: 'dessert' }) }),
    );
    expect(screen.getByAltText('Mexican Cheese Cornbread Biscuits-image')).toBe(
      image,
    );
    expect(image.parentElement).toHaveAttribute('data-loading', 'false');
    expect(screen.getByText('meal: dessert')).toBeVisible();

    rerender(
      await Home({ searchParams: Promise.resolve({ q: 'no-such-recipe' }) }),
    );
    expect(screen.getByAltText('Mexican Cheese Cornbread Biscuits-image')).toBe(
      image,
    );
    expect(screen.getByLabelText('Search Input')).toHaveValue('no-such-recipe');
    expect(screen.getByText('No recipes found.')).toBeVisible();
  });
});
