import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import TopRecipes from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';

vi.mock('@/utils', () => ({
  randomRecipeIndexFromDate: vi.fn(() => 0),
}));

describe('TopRecipes', () => {
  const mockRecipes = [
    makeRecipe({ id: '1', name: 'Recipe One' }),
    makeRecipe({ id: '2', name: 'Recipe Two' }),
    makeRecipe({ id: '3', name: 'Recipe Three' }),
  ];

  it('renders the today recipe', () => {
    render(<TopRecipes topRecipes={mockRecipes} />);
    expect(screen.getByText('Recipe One')).toBeVisible();
  });

  it('renders other recipes', () => {
    render(<TopRecipes topRecipes={mockRecipes} />);
    expect(screen.getByText('Recipe Two')).toBeVisible();
    expect(screen.getByText('Recipe Three')).toBeVisible();
  });

  it('renders all three recipes', () => {
    render(<TopRecipes topRecipes={mockRecipes} />);
    mockRecipes.forEach((recipe) => {
      expect(screen.getByText(recipe.name)).toBeVisible();
    });
  });
});
