import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchInput from '..';

const getSearchInput = () => screen.getByLabelText('Search Input');
const getSearchButton = () => screen.getByLabelText('Search');

describe('SearchInput', () => {
  const defaultProps = {
    searchText: '',
    onSearchTextChange: vi.fn(),
    onSearch: vi.fn(),
  };

  it('renders search input', () => {
    render(<SearchInput {...defaultProps} />);
    expect(getSearchInput()).toBeVisible();
  });

  it('renders search button', () => {
    render(<SearchInput {...defaultProps} />);
    expect(getSearchButton()).toBeVisible();
  });

  it('displays the searchText value in the input', () => {
    render(<SearchInput {...defaultProps} searchText='test query' />);
    expect(getSearchInput()).toHaveValue('test query');
  });

  it('calls onSearchTextChange when typing in search input', async () => {
    const onSearchTextChange = vi.fn();
    render(
      <SearchInput {...defaultProps} onSearchTextChange={onSearchTextChange} />,
    );
    await userEvent.type(getSearchInput(), 'a');
    expect(onSearchTextChange).toHaveBeenCalledWith('a');
  });

  it('calls onSearch when search button is clicked', async () => {
    const onSearch = vi.fn();
    render(<SearchInput {...defaultProps} onSearch={onSearch} />);
    await userEvent.click(getSearchButton());
    expect(onSearch).toHaveBeenCalledTimes(1);
  });

  it('calls onSearch when Enter key is pressed in input', async () => {
    const onSearch = vi.fn();
    render(<SearchInput {...defaultProps} onSearch={onSearch} />);
    await userEvent.type(getSearchInput(), '{Enter}');
    expect(onSearch).toHaveBeenCalledTimes(1);
  });
});
