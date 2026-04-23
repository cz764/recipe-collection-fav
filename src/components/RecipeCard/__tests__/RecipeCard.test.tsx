import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeCard } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';
import { TAGS_LIMIT } from '@/constants';
import { pushMock } from '../../../../vitest.setup';

describe('RecipeCard', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

  it('renders recipe name', () => {
    const name = 'Spaghetti Carbonara';
    const recipe = makeRecipe({ name });
    render(<RecipeCard recipeData={recipe} />);
    expect(screen.getByText(name)).toBeVisible();
  });

  it('renders recipe image with correct alt text', () => {
    const name = 'Pizza';
    const recipe = makeRecipe({ name, pictureUrl: '/pizza.jpg' });
    render(<RecipeCard recipeData={recipe} />);
    expect(screen.getByAltText(`${name}-image`)).toBeVisible();
  });

  it('renders recipe description', () => {
    const description = 'A classic Italian pasta dish';
    const recipe = makeRecipe({ description });
    render(<RecipeCard recipeData={recipe} />);
    expect(screen.getByText(description)).toBeVisible();
  });

  it('renders tags', () => {
    const tags = ['Italian', 'Pasta', 'Dinner'];
    const recipe = makeRecipe({ tags });
    render(<RecipeCard recipeData={recipe} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeVisible();
    });
  });

  it(`renders up to ${TAGS_LIMIT} tags`, () => {
    const tags = ['Italian', 'Pasta', 'Dinner', 'One Pot'];
    const recipe = makeRecipe({ tags });
    render(<RecipeCard recipeData={recipe} />);
    const items = screen.getAllByTestId('recipe-tags');
    expect(items).toHaveLength(TAGS_LIMIT);
  });

  it('navigates to recipe details on press', async () => {
    const user = userEvent.setup();
    const recipe = makeRecipe({ id: '42' });
    render(<RecipeCard recipeData={recipe} />);
    await user.click(screen.getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/details/42');
  });

  it('encodes ids with special characters in the URL', async () => {
    const user = userEvent.setup();
    const recipe = makeRecipe({ id: 'a b/c' });
    render(<RecipeCard recipeData={recipe} />);
    await user.click(screen.getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/details/a%20b%2Fc');
  });
});
