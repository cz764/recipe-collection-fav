import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import RecipeEW from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';
import { TAGS_LIMIT } from '@/constants/constants';

describe('RecipeEW', () => {
  it('renders recipe name', () => {
    const name = 'Grilled Salmon';
    const recipe = makeRecipe({ name });
    render(<RecipeEW recipe={recipe} />);
    expect(screen.getByText(name)).toBeVisible();
  });

  it('renders recipe image with correct alt text', () => {
    const name = 'Fish Tacos';
    const recipe = makeRecipe({ name, pictureUrl: '/tacos.jpg' });
    render(<RecipeEW recipe={recipe} />);
    expect(screen.getByAltText(`${name}-image`)).toBeVisible();
  });

  it('renders tags', () => {
    const tags = ['Seafood', 'Healthy', 'Quick'];
    const recipe = makeRecipe({ tags });
    render(<RecipeEW recipe={recipe} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeVisible();
    });
  });

  it(`renders up to ${TAGS_LIMIT} tags`, () => {
    const tags = ['Seafood', 'Healthy', 'Quick', 'Low-carb'];
    const recipe = makeRecipe({ tags });
    render(<RecipeEW recipe={recipe} />);
    const items = screen.getAllByTestId('recipe-tags');
    expect(items).toHaveLength(TAGS_LIMIT);
  });
});
