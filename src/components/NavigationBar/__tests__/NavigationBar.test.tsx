import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NavigationBar, defaultMenuItems } from '..';

const fixtureMenuItems = [
  { name: 'First Item', link: '/first' },
  { name: 'Second Item', link: '/second?with=query' },
];

describe('NavigationBar', () => {
  it('renders the logo linking to the home page', () => {
    render(<NavigationBar menuItems={fixtureMenuItems} />);
    const logo = screen.getByAltText('logo');
    expect(logo).toBeVisible();
    expect(logo.closest('a')).toHaveAttribute('href', '/');
  });

  it('renders all menu items with their links', () => {
    render(<NavigationBar menuItems={fixtureMenuItems} />);

    fixtureMenuItems.forEach(({ name, link }) => {
      const navLink = screen.getByRole('link', { name });
      expect(navLink).toBeVisible();
      expect(navLink).toHaveAttribute('href', link);
    });
  });

  it('renders menu toggle button', () => {
    render(<NavigationBar menuItems={fixtureMenuItems} />);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('opens the collapsed menu when the toggle is clicked', async () => {
    render(<NavigationBar menuItems={fixtureMenuItems} />);

    await userEvent.click(screen.getByLabelText('Open menu'));

    // Each item now appears twice: inline nav + opened menu
    fixtureMenuItems.forEach(({ name, link }) => {
      const links = screen.getAllByRole('link', { name });
      expect(links).toHaveLength(2);
      links.forEach((l) => expect(l).toHaveAttribute('href', link));
    });
    expect(screen.getByLabelText('Close menu')).toBeInTheDocument();
  });

  it('closes the menu when the toggle is clicked again', async () => {
    render(<NavigationBar menuItems={fixtureMenuItems} />);

    await userEvent.click(screen.getByLabelText('Open menu'));
    await userEvent.click(screen.getByLabelText('Close menu'));

    // The menu animates out, so wait for its items to be removed
    await waitFor(() => {
      fixtureMenuItems.forEach(({ name }) => {
        expect(screen.getAllByRole('link', { name })).toHaveLength(1);
      });
    });
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });

  it('renders the default menu when no menuItems prop is given', () => {
    render(<NavigationBar />);

    defaultMenuItems.forEach(({ name, link }) => {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', link);
    });
  });
});
