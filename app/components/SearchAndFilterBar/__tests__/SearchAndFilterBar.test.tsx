import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchAndFilterBar from '..';

describe('SearchAndFilterBar', () => {
  it('renders search input', () => {
    render(<SearchAndFilterBar />);
    expect(screen.getByLabelText('Search')).toBeVisible();
  });

  it('renders filter button', () => {
    render(<SearchAndFilterBar />);
    expect(screen.getByLabelText('Filter')).toBeVisible();
  });

  it('renders add button with link to /add', () => {
    render(<SearchAndFilterBar />);
    const addButton = screen.getByText('Add');
    expect(addButton).toBeVisible();
    expect(addButton).toHaveAttribute('href', '/add');
  });

  it('renders recipe count', () => {
    render(<SearchAndFilterBar />);
    // Todo: change this to recipeList.length after state is added
    expect(screen.getByText('20 recipes')).toBeVisible();
  });
});
