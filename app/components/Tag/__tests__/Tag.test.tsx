import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Tag } from '..';

describe('Tag', () => {
  it('renders the tag name', () => {
    render(<Tag name='Vegetarian' />);
    expect(screen.getByText('Vegetarian')).toBeVisible();
  });

  it('renders different tag names correctly', () => {
    const { rerender } = render(<Tag name='Quick' />);
    expect(screen.getByText('Quick')).toBeVisible();

    rerender(<Tag name='Easy' />);
    expect(screen.getByText('Easy')).toBeVisible();
  });
});
