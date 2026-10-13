import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Page from '../page';

const { getRecipeBySlug, notFound, recipe } = await vi.hoisted(async () => {
  const { makeRecipe } = await import('@/components/__tests__/mockData');
  return {
    getRecipeBySlug: vi.fn(),
    notFound: vi.fn(() => {
      throw new Error('NEXT_NOT_FOUND');
    }),
    recipe: makeRecipe({ slug: 'milk-bread', name: 'Milk Bread' }),
  };
});

vi.mock('@/server/recipes', () => ({ getRecipeBySlug }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  notFound,
}));

const renderPage = async (slug: string) =>
  render(await Page({ params: Promise.resolve({ slug }) }));

describe('details page', () => {
  beforeEach(() => {
    getRecipeBySlug.mockReset();
    notFound.mockClear();
  });

  it('renders the recipe for a known slug', async () => {
    getRecipeBySlug.mockResolvedValue(recipe);
    await renderPage('milk-bread');
    expect(getRecipeBySlug).toHaveBeenCalledWith('milk-bread');
    expect(
      screen.getByRole('heading', { name: 'Milk Bread' }),
    ).toBeInTheDocument();
  });

  it('renders the not-found page for an unknown slug', async () => {
    getRecipeBySlug.mockResolvedValue(undefined);
    await expect(renderPage('missing')).rejects.toThrow('NEXT_NOT_FOUND');
    expect(notFound).toHaveBeenCalledTimes(1);
  });

  it('lets query failures reach the route error boundary', async () => {
    getRecipeBySlug.mockRejectedValue(new Error('Failed to load recipe'));
    await expect(renderPage('milk-bread')).rejects.toThrow(
      'Failed to load recipe',
    );
    expect(notFound).not.toHaveBeenCalled();
  });
});
