import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecipeDisplaySection from '..';
import { makeRecipe } from '@/components/__tests__/mockData';

describe('RecipeDisplaySection', () => {
  const mockRecipeList = [
    makeRecipe({ id: '1', name: 'Spaghetti Carbonara' }),
    makeRecipe({ id: '2', name: 'Chicken Curry' }),
    makeRecipe({ id: '3', name: 'Caesar Salad' }),
  ];

  it('renders SearchAndFilterBar', () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    expect(screen.getByLabelText('Search Input')).toBeVisible();
  });

  it('renders all recipe cards', () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    expect(screen.getByText('Spaghetti Carbonara')).toBeVisible();
    expect(screen.getByText('Chicken Curry')).toBeVisible();
    expect(screen.getByText('Caesar Salad')).toBeVisible();
  });

  it('renders empty state when no recipes', () => {
    render(<RecipeDisplaySection recipeList={[]} />);
    expect(screen.getByLabelText('Search Input')).toBeVisible();
    expect(screen.queryByText('Spaghetti Carbonara')).not.toBeInTheDocument();
  });
});
