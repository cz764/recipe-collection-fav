import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TodayRecipe } from '..';
import { makeRecipe } from '@/components/__tests__/mockData';
import { TAGS_LIMIT, INGREDIENTS_LIMIT } from '@/constants';

describe('TodayRecipe', () => {
  it('renders "Today\'s recipe" heading', () => {
    const recipe = makeRecipe();
    render(<TodayRecipe recipe={recipe} />);
    expect(screen.getByText("Today's recipe")).toBeVisible();
  });

  it('renders recipe name', () => {
    const name = 'Beef Stew';
    const recipe = makeRecipe({ name });
    render(<TodayRecipe recipe={recipe} />);
    expect(screen.getByText(name)).toBeVisible();
  });

  it('renders recipe image with correct alt text', () => {
    const name = 'Chicken Curry';
    const recipe = makeRecipe({ name, pictureUrl: '/curry.jpg' });
    render(<TodayRecipe recipe={recipe} />);
    expect(screen.getByAltText(`${name}-image`)).toBeVisible();
  });

  it('renders recipe description', () => {
    const description = 'A hearty winter dish';
    const recipe = makeRecipe({ description });
    render(<TodayRecipe recipe={recipe} />);
    expect(screen.getByText(description)).toBeVisible();
  });

  it('renders ingredients section', () => {
    const ingredients = [
      { name: 'Onion', amount: 1, unit: 'piece' },
      { name: 'Pepper', amount: 2, unit: 'tbsp' },
    ];
    const recipe = makeRecipe({ ingredients });
    render(<TodayRecipe recipe={recipe} />);
    expect(screen.getByText('Ingredients:')).toBeVisible();
    expect(screen.getByText('Onion, Pepper')).toBeVisible();
  });

  it('renders tags', () => {
    const tags = ['Spicy', 'Asian', 'Quick'];
    const recipe = makeRecipe({ tags });
    render(<TodayRecipe recipe={recipe} />);
    tags.forEach((tag) => {
      expect(screen.getByText(tag)).toBeVisible();
    });
  });

  it(`renders up to ${TAGS_LIMIT} tags`, () => {
    const tags = ['Spicy', 'Asian', 'Quick', 'Healthy'];
    const recipe = makeRecipe({ tags });
    render(<TodayRecipe recipe={recipe} />);
    const items = screen.getAllByTestId('recipe-tags');
    expect(items).toHaveLength(TAGS_LIMIT);
  });

  it(`renders up to ${INGREDIENTS_LIMIT} ingredients`, () => {
    const ingredients = [
      { name: 'Onion', amount: 1 },
      { name: 'Garlic', amount: 2 },
      { name: 'Tomato', amount: 3 },
      { name: 'Pepper', amount: 4 },
      { name: 'Salt', amount: 5 },
      { name: 'Oil', amount: 6 },
    ];
    const recipe = makeRecipe({ ingredients });
    render(<TodayRecipe recipe={recipe} />);
    const expectedIngredients = ingredients
      .slice(0, INGREDIENTS_LIMIT)
      .map(({ name }) => name)
      .join(', ');
    expect(screen.getByText(expectedIngredients)).toBeVisible();
  });
});
