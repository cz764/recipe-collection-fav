import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeLoader } from '..';
import { fetchRecipes } from '@/api/recipes';

describe('RecipeLoader', () => {
  it('passes filtered results to the results section', async () => {
    render(await RecipeLoader({ searchParams: { cuisine: 'Chinese' } }));
    const count = fetchRecipes({ cuisine: 'Chinese' }).length;
    expect(
      screen.getByText(`${count} ${count <= 1 ? 'recipe' : 'recipes'}`),
    ).toBeVisible();
    expect(screen.getByText('cuisine: chinese')).toBeVisible();
  });

  it('shows the empty state when URL filters have no results', async () => {
    render(await RecipeLoader({ searchParams: { type: 'unknown' } }));
    expect(screen.getByText('0 recipe')).toBeVisible();
    expect(screen.getByText('type: unknown')).toBeVisible();
    expect(screen.getByText('No recipes found.')).toBeVisible();
  });
});

it('initializes search from a direct URL and filters results', async () => {
  render(
    await RecipeLoader({ searchParams: { q: ' Egg ', cuisine: 'modern' } }),
  );
  expect(screen.getByLabelText('Search Input')).toHaveValue('Egg');
  expect(screen.getByText('Search: Egg')).toBeVisible();
  expect(screen.getByText('1 recipe')).toBeVisible();
});
