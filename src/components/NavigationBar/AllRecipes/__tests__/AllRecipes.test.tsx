import { describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AllRecipes } from '..';

// Keep link interactions local to jsdom while testing the real menu behavior.
vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: React.ComponentProps<'a'>) => (
    <a
      {...props}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        event.preventDefault();
      }}
    >
      {children}
    </a>
  ),
}));

describe('AllRecipes', () => {
  it('opens grouped category links with the intended filter URLs', async () => {
    render(<AllRecipes />);
    await userEvent.click(screen.getByRole('button', { name: 'All Recipes' }));
    await waitFor(() => expect(screen.getByRole('menu')).toBeVisible());
    for (const title of ['Meal', 'Cuisine', 'Dietary', 'Preparation']) {
      expect(screen.getByText(title)).toBeVisible();
    }
    for (const [name, href] of [
      ['View all recipes', '/'],
      ['Breakfast', '/?meal=breakfast'],
      ['Chinese', '/?cuisine=chinese'],
      ['Italian', '/?cuisine=italian'],
      ['Vegetarian', '/?tag=vegetarian'],
      ['One pot', '/?tag=one-pot'],
    ])
      expect(screen.getByRole('menuitem', { name })).toHaveAttribute(
        'href',
        href,
      );
  });

  it('supports keyboard opening, Escape, and focus return', async () => {
    render(<AllRecipes />);
    const trigger = screen.getByRole('button', { name: 'All Recipes' });
    await userEvent.tab();
    await userEvent.keyboard('{Enter}');
    await waitFor(() => expect(screen.getByRole('menu')).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
    await waitFor(() => expect(trigger).toHaveFocus());
  });

  it('notifies the mobile navbar to close after selecting a link', async () => {
    const onNavigate = vi.fn();
    render(<AllRecipes isMobile onNavigate={onNavigate} />);
    await userEvent.click(screen.getByRole('button', { name: 'All Recipes' }));
    await waitFor(() => expect(screen.getByRole('menu')).toBeVisible());
    await userEvent.click(screen.getByRole('menuitem', { name: 'Vegetarian' }));
    expect(onNavigate).toHaveBeenCalledOnce();
    await waitFor(() =>
      expect(screen.queryByRole('menu')).not.toBeInTheDocument(),
    );
  });
});
