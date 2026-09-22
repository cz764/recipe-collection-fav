import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeLoader } from '../RecipeLoader';
import { fetchRecipes } from '@/api/recipes';

describe('RecipeLoader', () => {
  it('passes filtered results to the results section', async () => {
    render(await RecipeLoader({ searchParams: { cuisine: 'Chinese' } }));
    expect(
      screen.getByText(
        `${fetchRecipes({ cuisine: 'Chinese' }).length} recipes`,
      ),
    ).toBeVisible();
    expect(screen.getByText("Today's recipe")).toBeVisible();
    expect(screen.getByText('cuisine: chinese')).toBeVisible();
  });

  it('keeps featured recipes visible when URL filters have no results', async () => {
    render(await RecipeLoader({ searchParams: { type: 'unknown' } }));
    expect(screen.getByText('0 recipes')).toBeVisible();
    expect(screen.getByText('type: unknown')).toBeVisible();
    expect(screen.getByText('No recipes found.')).toBeVisible();
    expect(screen.getByText("Today's recipe")).toBeVisible();
  });
});
