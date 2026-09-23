import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchAndFilterBar } from '..';

describe('SearchAndFilterBar', () => {
  const defaultProps = {
    searchText: '',
    onSearchTextChange: vi.fn(),
    onSearch: vi.fn(),
    onCategoryChange: vi.fn(),
    totalRecipes: 0,
    onOpenFilter: vi.fn(),
  };

  it('renders filter button', () => {
    render(<SearchAndFilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Open Filters')).toBeVisible();
  });

  it('calls onOpenFilter when filter button is clicked', async () => {
    const onOpenFilter = vi.fn();
    render(
      <SearchAndFilterBar {...defaultProps} onOpenFilter={onOpenFilter} />,
    );

    await userEvent.click(screen.getByLabelText('Open Filters'));

    expect(onOpenFilter).toHaveBeenCalledTimes(1);
  });

  it('renders recipe count', () => {
    const totalRecipes = 38;
    render(
      <SearchAndFilterBar {...defaultProps} totalRecipes={totalRecipes} />,
    );
    expect(screen.getByText(`${totalRecipes} recipes`)).toBeVisible();
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
