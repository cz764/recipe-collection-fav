import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { RecipeContent } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';

describe('RecipeContent', () => {
  it('renders recipe name in breadcrumb and heading', () => {
    const name = 'Sourdough Bread';
    render(<RecipeContent recipe={makeRecipe({ name })} />);
    expect(screen.getAllByText(name).length).toBeGreaterThanOrEqual(2);
    expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
  });

  it('renders a link back to all recipes', () => {
    render(<RecipeContent recipe={makeRecipe()} />);
    const allRecipes = screen.getByRole('link', { name: 'All Recipes' });
    expect(allRecipes).toHaveAttribute('href', '/');
  });

  it('renders the recipe picture with alt text', () => {
    const name = 'Pizza';
    render(
      <RecipeContent recipe={makeRecipe({ name, pictureUrl: '/pizza.jpg' })} />,
    );
    expect(screen.getByAltText(`${name}-picture`)).toBeInTheDocument();
  });

  it('renders the description', () => {
    const description = 'A classic Italian pasta dish';
    render(<RecipeContent recipe={makeRecipe({ description })} />);
    expect(screen.getByText(description)).toBeVisible();
  });

  it('renders the source', () => {
    const source = 'https://dummy.link';
    render(<RecipeContent recipe={makeRecipe({ source })} />);
    expect(screen.getByText('Recipe Reference')).toHaveAttribute(
      'href',
      source,
    );
  });

  it('renders equipment joined by commas', () => {
    const equipments = ['Pan', 'Knife', 'Whisk'];
    render(<RecipeContent recipe={makeRecipe({ equipments })} />);
    expect(screen.getByText('Pan, Knife, Whisk')).toBeVisible();
  });

  it('renders total time and yield', () => {
    render(
      <RecipeContent
        recipe={makeRecipe({ totalTime: 45, yieldServings: 6 })}
      />,
    );
    expect(screen.getByText('Total time: 45 mins')).toBeVisible();
    expect(screen.getByText('Yield: 6 servings')).toBeVisible();
  });

  it('renders each ingredient as a checkbox with name, amount, and unit', () => {
    const ingredients = [
      { name: 'Flour', amount: 500, unit: 'g' },
      { name: 'Water', amount: 350, unit: 'ml' },
      { name: 'Salt', amount: 10, unit: 'g' },
    ];
    render(<RecipeContent recipe={makeRecipe({ ingredients })} />);

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(ingredients.length);
    expect(screen.getByText('Flour 500 g')).toBeVisible();
    expect(screen.getByText('Water 350 ml')).toBeVisible();
    expect(screen.getByText('Salt 10 g')).toBeVisible();
  });

  it('renders prep steps', () => {
    const prep = ['Preheat oven to 200C', 'Line baking tray'];
    render(
      <RecipeContent recipe={makeRecipe({ steps: { prep, steps: [] } })} />,
    );
    prep.forEach((line) => {
      expect(screen.getByText(line)).toBeVisible();
    });
  });

  it('renders cooking steps in an ordered list', () => {
    const steps = [
      { detail: 'Mix flour and water' },
      { detail: 'Knead for 10 minutes' },
      { detail: 'Bake for 30 minutes' },
    ];
    const { container } = render(
      <RecipeContent recipe={makeRecipe({ steps: { prep: [], steps } })} />,
    );

    const list = container.querySelector('ol.list-decimal');
    expect(list).not.toBeNull();
    const items = within(list as HTMLElement).getAllByRole('listitem');
    expect(items).toHaveLength(steps.length);
    steps.forEach((step, index) => {
      expect(items[index]).toHaveTextContent(step.detail);
    });
  });

  it('renders a step image only when imageUrl is provided', () => {
    const steps = [
      { detail: 'With image', imageUrl: '/mix.jpg' },
      { detail: 'Without image' },
    ];
    render(
      <RecipeContent recipe={makeRecipe({ steps: { prep: [], steps } })} />,
    );

    expect(screen.getByAltText('step-0')).toHaveAttribute('src', '/mix.jpg');
    expect(screen.queryByAltText('step-1')).not.toBeInTheDocument();
  });

  it('renders with no ingredients, prep, or steps', () => {
    const { container } = render(
      <RecipeContent
        recipe={makeRecipe({
          ingredients: [],
          steps: { prep: [], steps: [] },
        })}
      />,
    );
    expect(screen.queryAllByRole('checkbox')).toHaveLength(0);
    const list = container.querySelector('ol.list-decimal') as HTMLElement;
    expect(within(list).queryAllByRole('listitem')).toHaveLength(0);
  });
});
