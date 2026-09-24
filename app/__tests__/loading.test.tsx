import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../loading';

const { location } = vi.hoisted(() => ({ location: { query: '' } }));
vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(location.query),
}));

describe('Home loading view', () => {
  it.each(['', 'q=++&campaign=test', 'q=&q=egg'])(
    'includes featured placeholders for the landing URL %s',
    (query) => {
      location.query = query;
      render(<Loading />);
      expect(
        screen.getByRole('status', { name: 'Loading featured recipes' }),
      ).toBeVisible();
      expect(
        screen.getByRole('status', { name: 'Loading recipe results' }),
      ).toBeVisible();
    },
  );
  it.each([
    'type=bakery',
    'q=Japanese',
    'meal=breakfast',
    'cuisine=invalid',
    'q=egg&q=',
  ])('shows only results placeholders for %s', (query) => {
    location.query = query;
    render(<Loading />);
    expect(
      screen.queryByRole('status', { name: 'Loading featured recipes' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('status', { name: 'Loading recipe results' }),
    ).toBeVisible();
  });
});
