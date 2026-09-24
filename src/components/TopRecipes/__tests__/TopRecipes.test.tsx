import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TopRecipes } from '../index';
import { makeRecipe } from '@/components/__tests__/mockData';

describe('TopRecipes', () => {
  const mockRecipes = [
    makeRecipe({ id: '1', name: 'Recipe One' }),
    makeRecipe({ id: '2', name: 'Recipe Two' }),
    makeRecipe({ id: '3', name: 'Recipe Three' }),
  ];

  it('labels the whole featured section with one heading', () => {
    render(<TopRecipes topRecipes={mockRecipes} />);
    const section = screen.getByRole('region', { name: "Today's recipe" });
    expect(section).toContainElement(
      screen.getByRole('heading', { level: 1, name: "Today's recipe" }),
    );
    mockRecipes.forEach((recipe) => {
      expect(section).toContainElement(screen.getByText(recipe.name));
    });
  });

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

  it('renders nothing when featured recipes are unavailable', () => {
    const { container } = render(<TopRecipes topRecipes={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('does not duplicate recipes when fewer than three are returned', () => {
    render(<TopRecipes topRecipes={mockRecipes.slice(0, 1)} />);
    expect(screen.getAllByText('Recipe One')).toHaveLength(1);
    expect(screen.queryByText('Recipe Two')).not.toBeInTheDocument();
  });
});
