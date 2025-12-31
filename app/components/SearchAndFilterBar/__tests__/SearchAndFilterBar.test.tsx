import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import SearchAndFilterBar from '..';

describe('SearchAndFilterBar', () => {
  const defaultProps = {
    searchText: '',
    onSearchTextChange: vi.fn(),
    onSearch: vi.fn(),
    totalRecipes: 0,
  };

  it('renders filter button', () => {
    render(<SearchAndFilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Open Filters')).toBeVisible();
  });

  it('renders add button with link to /add', () => {
    render(<SearchAndFilterBar {...defaultProps} />);
    const addButton = screen.getByText('Add');
    expect(addButton).toBeVisible();
    expect(addButton).toHaveAttribute('href', '/add');
  });

  it('renders recipe count', () => {
    const totalRecipes = 38;
    render(
      <SearchAndFilterBar {...defaultProps} totalRecipes={totalRecipes} />,
    );
    expect(screen.getByText(`${totalRecipes} recipes`)).toBeVisible();
  });
});
