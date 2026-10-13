import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import RouteError from '../error';

describe('route error boundary', () => {
  it('shows a retry control that re-renders the segment', async () => {
    const reset = vi.fn();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    render(<RouteError error={new Error('boom')} reset={reset} />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
    expect(
      screen.getByRole('link', { name: 'Back to all recipes' }),
    ).toHaveAttribute('href', '/');
    await userEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(reset).toHaveBeenCalledTimes(1);
  });
});
