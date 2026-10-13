import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
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

  it('displays no filter chips when URL filters are absent', () => {
    render(<SearchAndFilterBar {...defaultProps} />);

    expect(screen.queryByText(/Meal:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Cuisine:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Search:/)).not.toBeInTheDocument();
  });

  it('updates URL summaries directly when props change', () => {
    const { rerender } = render(
      <SearchAndFilterBar
        {...defaultProps}
        urlFilters={{ cuisine: 'latin-american', meal: 'breakfast', q: 'Egg' }}
      />,
    );
    expect(screen.getByText('Cuisine: Latin American')).toBeVisible();
    expect(screen.getByText('Meal: Breakfast')).toBeVisible();
    expect(screen.getByText('Search: Egg')).toBeVisible();

    rerender(
      <SearchAndFilterBar {...defaultProps} urlFilters={{ meal: 'dessert' }} />,
    );
    expect(
      screen.queryByText('Cuisine: Latin American'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Meal: Breakfast')).not.toBeInTheDocument();
    expect(screen.queryByText('Search: Egg')).not.toBeInTheDocument();
    expect(screen.getByText('Meal: Dessert')).toBeVisible();
  });

  it('removes the matching filter when its chip is closed', async () => {
    const onRemoveFilter = vi.fn();
    render(
      <SearchAndFilterBar
        {...defaultProps}
        urlFilters={{ type: 'bakery', q: 'dough' }}
        onRemoveFilter={onRemoveFilter}
      />,
    );
    const typeChip = screen.getByText('Type: Bakery').closest('div')!;
    await userEvent.click(
      within(typeChip).getByRole('button', { name: 'close chip' }),
    );
    expect(onRemoveFilter).toHaveBeenCalledWith('type');
    expect(onRemoveFilter).not.toHaveBeenCalledWith('q');
  });

  it('renders read-only chips without a remove handler', () => {
    render(
      <SearchAndFilterBar {...defaultProps} urlFilters={{ type: 'bakery' }} />,
    );
    expect(screen.getByText('Type: Bakery')).toBeVisible();
    expect(
      screen.queryByRole('button', { name: 'close chip' }),
    ).not.toBeInTheDocument();
  });
});
