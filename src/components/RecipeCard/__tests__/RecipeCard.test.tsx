import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { RecipeCard } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';
import { TAGS_LIMIT } from '@/constants';

describe('RecipeCard', () => {
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
});
