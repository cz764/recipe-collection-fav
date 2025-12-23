import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import NavigationBar from '..';

describe('NavigationBar', () => {
  it('renders the logo', () => {
    render(<NavigationBar />);
    expect(screen.getByAltText('logo')).toBeVisible();
  });

  it('renders all menu items', () => {
    render(<NavigationBar />);
    const menuItems = ['About', 'All Recipes', 'Chinese', 'Bake'];

    menuItems.forEach((item) => {
      expect(screen.getByRole('link', { name: item })).toBeVisible();
    });
  });

  it('renders menu toggle button', () => {
    render(<NavigationBar />);
    expect(screen.getByLabelText('Open menu')).toBeInTheDocument();
  });
});
