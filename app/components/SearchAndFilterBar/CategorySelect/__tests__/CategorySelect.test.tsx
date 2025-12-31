import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import CategorySelect, { categories, CATEGORY_LIMIT } from '..';

describe('CategorySelect', () => {
  const defaultProps = {
    onCategoryChange: vi.fn(),
  };

  it('renders select with placeholder', () => {
    render(<CategorySelect {...defaultProps} />);
    expect(screen.getByText('Select up to 3 categories')).toBeVisible();
  });

  it('renders select with aria-label for accessibility', () => {
    render(<CategorySelect {...defaultProps} />);
    expect(screen.getByLabelText('Category')).toBeInTheDocument();
  });

  it('has correct number of categories', () => {
    expect(categories).toHaveLength(8);
  });

  it('has category limit of 3', () => {
    expect(CATEGORY_LIMIT).toBe(3);
  });

  it('contains expected category options', () => {
    const expectedCategories = [
      'Chinese',
      'Dessert',
      'Vegetarian',
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
