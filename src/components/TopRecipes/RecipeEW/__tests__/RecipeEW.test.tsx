import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeEW } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';
import { TAGS_LIMIT } from '@/constants';
import { pushMock } from '../../../../../vitest.setup';

describe('RecipeEW', () => {
  beforeEach(() => {
    pushMock.mockClear();
  });

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

  it('navigates to recipe details on press', async () => {
    const user = userEvent.setup();
    const recipe = makeRecipe({ id: '7' });
    render(<RecipeEW recipe={recipe} />);
    await user.click(screen.getByRole('button'));
    expect(pushMock).toHaveBeenCalledWith('/details/7');
  });
});
