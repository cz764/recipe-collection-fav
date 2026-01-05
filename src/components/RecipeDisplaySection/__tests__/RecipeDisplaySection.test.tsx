import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeDisplaySection } from '..';
import { makeRecipe } from '@/components/__tests__/mockData';
import { ITEMS_PER_PAGE } from '@/constants';

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

  describe('pagination', () => {
    const createManyRecipes = (count: number) =>
      Array.from({ length: count }, (_, i) =>
        makeRecipe({ id: `${i + 1}`, name: `Recipe ${i + 1}` }),
      );

    it('does not show pagination when recipes fit on one page', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE);
      render(<RecipeDisplaySection recipeList={recipes} />);

      expect(screen.queryByRole('navigation')).not.toBeInTheDocument();
    });

    it('shows pagination when recipes exceed one page', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE + 1);
      render(<RecipeDisplaySection recipeList={recipes} />);

      expect(screen.getByRole('navigation')).toBeVisible();
    });

    it('displays correct items on first page', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE + 3);
      render(<RecipeDisplaySection recipeList={recipes} />);

      expect(screen.getByText('Recipe 1')).toBeVisible();
      expect(screen.getByText(`Recipe ${ITEMS_PER_PAGE}`)).toBeVisible();
      expect(
        screen.queryByText(`Recipe ${ITEMS_PER_PAGE + 1}`),
      ).not.toBeInTheDocument();
    });

    it('displays correct items on second page', async () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE + 3);
      render(<RecipeDisplaySection recipeList={recipes} />);

      const pagination = screen.getByRole('navigation');
      await userEvent.click(
        within(pagination).getByRole('button', { name: /pagination item 2/ }),
      );

      expect(screen.getByText(`Recipe ${ITEMS_PER_PAGE + 1}`)).toBeVisible();
      expect(screen.getByText(`Recipe ${ITEMS_PER_PAGE + 3}`)).toBeVisible();
      expect(screen.queryByText('Recipe 1')).not.toBeInTheDocument();
    });

    it('calculates total pages correctly', () => {
      // 2 full pages + 1 partial = 3 pages
      const recipes = createManyRecipes(ITEMS_PER_PAGE * 2 + 1);
      render(<RecipeDisplaySection recipeList={recipes} />);

      const pagination = screen.getByRole('navigation');
      expect(
        within(pagination).getByRole('button', { name: /pagination item 1/ }),
      ).toBeVisible();
      expect(
        within(pagination).getByRole('button', { name: /pagination item 2/ }),
      ).toBeVisible();
      expect(
        within(pagination).getByRole('button', { name: /pagination item 3/ }),
      ).toBeVisible();
      expect(
        within(pagination).queryByRole('button', { name: /pagination item 4/ }),
      ).not.toBeInTheDocument();
    });

    it('calculates total pages correctly when evenly divisible', () => {
      const recipes = createManyRecipes(ITEMS_PER_PAGE * 2);
      render(<RecipeDisplaySection recipeList={recipes} />);

      const pagination = screen.getByRole('navigation');
      expect(
        within(pagination).getByRole('button', {
          name: /pagination item 1/,
        }),
      ).toBeVisible();
      expect(
        within(pagination).getByRole('button', { name: /pagination item 2/ }),
      ).toBeVisible();
      expect(
        within(pagination).queryByRole('button', { name: /pagination item 3/ }),
      ).not.toBeInTheDocument();
    });
  });
});
