import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SearchAndFilterBar } from '..';

describe('SearchAndFilterBar', () => {
  const defaultProps = {
    searchText: '',
    onSearchTextChange: vi.fn(),
    onSearch: vi.fn(),
    totalRecipes: 0,
  };

  it.each([
    [0, '0 recipe'],
    [1, '1 recipe'],
    [2, '2 recipes'],
    [38, '38 recipes'],
  ])('renders recipe count %i as "%s"', (totalRecipes, label) => {
    render(
      <SearchAndFilterBar {...defaultProps} totalRecipes={totalRecipes} />,
    );
    expect(screen.getByText(label)).toBeVisible();
  });

  it('displays no filter tags when URL filters are absent', () => {
    render(<SearchAndFilterBar {...defaultProps} />);

    expect(screen.queryByText(/meal:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/cuisine:/)).not.toBeInTheDocument();
  });

  it('updates URL summaries directly when props change', () => {
    const { rerender } = render(
      <SearchAndFilterBar
        {...defaultProps}
        urlFilters={{ cuisine: 'chinese', meal: 'breakfast' }}
      />,
    );
    expect(screen.getByText('cuisine: chinese')).toBeVisible();
    expect(screen.getByText('meal: breakfast')).toBeVisible();

    rerender(
      <SearchAndFilterBar {...defaultProps} urlFilters={{ meal: 'dessert' }} />,
    );
    expect(screen.queryByText('cuisine: chinese')).not.toBeInTheDocument();
    expect(screen.queryByText('meal: breakfast')).not.toBeInTheDocument();
    expect(screen.getByText('meal: dessert')).toBeVisible();
  });
});
