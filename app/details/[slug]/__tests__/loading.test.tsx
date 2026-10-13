import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Loading from '../loading';

describe('details loading view', () => {
  it('announces the recipe skeleton while the page loads', () => {
    render(<Loading />);
    expect(
      screen.getByRole('status', { name: 'Loading recipe' }),
    ).toBeVisible();
  });
});
