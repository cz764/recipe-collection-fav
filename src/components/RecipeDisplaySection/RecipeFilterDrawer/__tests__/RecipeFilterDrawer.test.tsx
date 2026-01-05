import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { RecipeFilterDrawer } from '..';

describe('RecipeFilterDrawer', () => {
  const defaultProps = {
    isOpen: true,
    onOpenChange: vi.fn(),
    onDrawerAction: vi.fn(),
  };

  it('renders drawer header', () => {
    render(<RecipeFilterDrawer {...defaultProps} />);
    expect(screen.getByText('Filter Recipes')).toBeVisible();
  });

  it('renders Type checkbox group with all options', () => {
    render(<RecipeFilterDrawer {...defaultProps} />);
    expect(screen.getByText('Type')).toBeVisible();
    expect(screen.getByLabelText('Breakfast')).toBeInTheDocument();
    expect(screen.getByLabelText('Lunch')).toBeInTheDocument();
    expect(screen.getByLabelText('Dinner')).toBeInTheDocument();
    expect(screen.getByLabelText('Dessert')).toBeInTheDocument();
    expect(screen.getByLabelText('Snack')).toBeInTheDocument();
  });

  it('renders Language checkbox group with all options', () => {
    render(<RecipeFilterDrawer {...defaultProps} />);
    expect(screen.getByText('Language')).toBeVisible();
    expect(screen.getByLabelText('English')).toBeInTheDocument();
    expect(screen.getByLabelText('中文')).toBeInTheDocument();
  });

  it('renders Close and Filter buttons', () => {
    render(<RecipeFilterDrawer {...defaultProps} />);
    // HeroUI Drawer has a built-in close button (X icon) plus our Close button
    const closeButtons = screen.getAllByRole('button', { name: 'Close' });
    expect(closeButtons).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Filter' })).toBeVisible();
  });

  it('calls onDrawerAction when Filter button is clicked', async () => {
    const onDrawerAction = vi.fn();
    render(
      <RecipeFilterDrawer {...defaultProps} onDrawerAction={onDrawerAction} />,
    );

    await userEvent.click(screen.getByRole('button', { name: 'Filter' }));

    expect(onDrawerAction).toHaveBeenCalledTimes(1);
    expect(onDrawerAction).toHaveBeenCalledWith(expect.any(Map));
  });

  it('does not render content when isOpen is false', () => {
    render(<RecipeFilterDrawer {...defaultProps} isOpen={false} />);
    expect(screen.queryByText('Filter Recipes')).not.toBeInTheDocument();
  });
});
