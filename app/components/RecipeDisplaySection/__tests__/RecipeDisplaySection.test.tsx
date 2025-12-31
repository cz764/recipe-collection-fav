import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RecipeDisplaySection from '..';
import { makeRecipe } from '@/components/__tests__/mockData';

describe('RecipeDisplaySection', () => {
  const mockRecipeList = [
    makeRecipe({ id: '1', name: 'Spaghetti Carbonara' }),
    makeRecipe({ id: '2', name: 'Chicken Curry' }),
    makeRecipe({ id: '3', name: 'Caesar Salad' }),
  ];

  const getSearchInput = () => screen.getByLabelText('Search Input');

  it('renders SearchAndFilterBar', () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    expect(getSearchInput()).toBeVisible();
  });

  it('renders all recipe cards', () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    expect(screen.getByText('Spaghetti Carbonara')).toBeVisible();
    expect(screen.getByText('Chicken Curry')).toBeVisible();
    expect(screen.getByText('Caesar Salad')).toBeVisible();
  });

  it('renders empty state when no recipes', () => {
    render(<RecipeDisplaySection recipeList={[]} />);
    expect(getSearchInput()).toBeVisible();
    expect(screen.queryByText('Spaghetti Carbonara')).not.toBeInTheDocument();
  });

  it('filters recipes when search is applied via Enter key', async () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    const input = getSearchInput();

    await userEvent.type(input, 'spaghetti{Enter}');

    expect(screen.getByText('Spaghetti Carbonara')).toBeVisible();
    expect(screen.queryByText('Chicken Curry')).not.toBeInTheDocument();
    expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
  });

  it('filters recipes when search button is clicked', async () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    const input = getSearchInput();
    const searchButton = screen.getByLabelText('Search');

    await userEvent.type(input, 'chicken');
    await userEvent.click(searchButton);

    expect(screen.queryByText('Spaghetti Carbonara')).not.toBeInTheDocument();
    expect(screen.getByText('Chicken Curry')).toBeVisible();
    expect(screen.queryByText('Caesar Salad')).not.toBeInTheDocument();
  });

  it('shows all recipes when search is cleared', async () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    const input = getSearchInput();

    // Apply search first
    await userEvent.type(input, 'spaghetti{Enter}');
    expect(screen.queryByText('Chicken Curry')).not.toBeInTheDocument();

    // Clear and search again
    await userEvent.clear(input);
    await userEvent.type(input, '{Enter}');

    expect(screen.getByText('Spaghetti Carbonara')).toBeVisible();
    expect(screen.getByText('Chicken Curry')).toBeVisible();
    expect(screen.getByText('Caesar Salad')).toBeVisible();
  });

  it('shows correct recipe count after filtering', async () => {
    render(<RecipeDisplaySection recipeList={mockRecipeList} />);
    expect(screen.getByText(`${mockRecipeList.length} recipes`)).toBeVisible();

    const input = getSearchInput();
    await userEvent.type(input, 'spaghetti{Enter}');
    expect(screen.getByText('1 recipes')).toBeVisible();
  });
});
