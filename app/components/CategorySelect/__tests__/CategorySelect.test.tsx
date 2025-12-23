import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategorySelect, { categories } from '..';

describe('CategorySelect', () => {
  it('renders select with placeholder', () => {
    render(<CategorySelect />);
    expect(screen.getByText('Select a category')).toBeVisible();
  });

  it('renders select with aria-label for accessibility', () => {
    render(<CategorySelect />);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('has correct number of categories', () => {
    expect(categories).toHaveLength(8);
  });

  it('contains expected category options', () => {
    const expectedCategories = [
      'Chinese',
      'Bake',
      'Vegeterian',
      'Italian',
      'One Pot',
      'Noodle',
      'Breakfast',
      'Healthy',
    ];
    categories.forEach((category, index) => {
      expect(category.label).toBe(expectedCategories[index]);
    });
  });
});
