import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchAndFilterBar from '..';

describe('SearchAndFilterBar', () => {
  const defaultProps = {
    searchText: '',
    onSearchTextChange: vi.fn(),
    onSearch: vi.fn(),
  };

  it('renders search input', () => {
    render(<SearchAndFilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Search Input')).toBeVisible();
  });

  it('renders search button', () => {
    render(<SearchAndFilterBar {...defaultProps} />);
    expect(screen.getByLabelText('Search')).toBeVisible();
  });

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
    render(<SearchAndFilterBar {...defaultProps} />);
    // Todo: change this to recipeList.length after state is added
    expect(screen.getByText('5 recipes')).toBeVisible();
  });

  it('displays the searchText value in the input', () => {
    render(<SearchAndFilterBar {...defaultProps} searchText='test query' />);
    expect(screen.getByLabelText('Search Input')).toHaveValue('test query');
  });

  it('calls onSearchTextChange when typing in search input', async () => {
    const onSearchTextChange = vi.fn();
    render(
      <SearchAndFilterBar {...defaultProps} onSearchTextChange={onSearchTextChange} />
    );
    const input = screen.getByLabelText('Search Input');
    await userEvent.type(input, 'a');
    expect(onSearchTextChange).toHaveBeenCalledWith('a');
  });

  it('calls onSearch when search button is clicked', async () => {
    const onSearch = vi.fn();
    render(<SearchAndFilterBar {...defaultProps} onSearch={onSearch} />);
    const searchButton = screen.getByLabelText('Search');
    await userEvent.click(searchButton);
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when Enter key is pressed in input', async () => {
    const onSearch = vi.fn();
    render(<SearchAndFilterBar {...defaultProps} onSearch={onSearch} />);
    const input = screen.getByLabelText('Search Input');
    await userEvent.type(input, '{Enter}');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
