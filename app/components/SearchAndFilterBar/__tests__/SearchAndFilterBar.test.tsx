import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchAndFilterBar } from '..';
import type { FilterMap } from '@/data/filter';

describe('SearchAndFilterBar', () => {
  const defaultProps = {
    searchText: '',
    onSearchTextChange: vi.fn(),
    onSearch: vi.fn(),
    onCategoryChange: vi.fn(),
    totalRecipes: 0,
    onOpenFilter: vi.fn(),
    filterMap: new Map(),
  };

  it('renders filter button', () => {
    render(<SearchAndFilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Open Filters')).toBeVisible();
  });

  it('calls onOpenFilter when filter button is clicked', async () => {
    const onOpenFilter = vi.fn();
    render(<SearchAndFilterBar {...defaultProps} onOpenFilter={onOpenFilter} />);

    await userEvent.click(screen.getByLabelText('Open Filters'));

    expect(onOpenFilter).toHaveBeenCalledTimes(1);
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

  it('displays active filters from filterMap', () => {
    const filterMap: FilterMap = new Map([
      ['type', ['breakfast', 'lunch']],
      ['cuisine', ['Italian']],
    ]);
    render(<SearchAndFilterBar {...defaultProps} filterMap={filterMap} />);

    expect(screen.getByText('type: breakfast,lunch')).toBeVisible();
    expect(screen.getByText('cuisine: Italian')).toBeVisible();
  });

  it('displays no filter tags when filterMap is empty', () => {
    render(<SearchAndFilterBar {...defaultProps} filterMap={new Map()} />);

    expect(screen.queryByText(/type:/)).not.toBeInTheDocument();
    expect(screen.queryByText(/cuisine:/)).not.toBeInTheDocument();
  });
});
