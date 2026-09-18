import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { RecipeImage } from '..';

describe('RecipeImage', () => {
  it('requests optimized candidates with the supplied display size and lazy loading', () => {
    render(<RecipeImage src='/recipe.jpg' alt='Recipe' sizes='120px' />);
    const image = screen.getByRole('img');

    expect(image.getAttribute('src')).toContain('/_next/image?');
    expect(image.getAttribute('srcset')).toContain('w=256');
    expect(image).toHaveAttribute('sizes', '120px');
    expect(image).toHaveAttribute('loading', 'lazy');
    expect(image.parentElement).toHaveAttribute('data-loading', 'true');
  });

  it('ends the shimmer after loading and restarts it for a different source', async () => {
    const { rerender } = render(
      <RecipeImage src='/first.jpg' alt='Recipe' sizes='120px' />,
    );
    const image = screen.getByRole('img') as HTMLImageElement;
    // Supply dimensions normally provided by browser layout (absent in jsdom).
    image.parentElement!.style.position = 'relative';
    Object.defineProperty(image, 'height', { value: 120 });
    fireEvent.load(image);
    await waitFor(() =>
      expect(image.parentElement).toHaveAttribute('data-loading', 'false'),
    );

    rerender(<RecipeImage src='/second.jpg' alt='Recipe' sizes='120px' />);
    expect(screen.getByRole('img').parentElement).toHaveAttribute(
      'data-loading',
      'true',
    );
  });

  it('stops the shimmer on failure and preserves the image alt text', () => {
    render(<RecipeImage src='/missing.jpg' alt='Recipe' sizes='120px' />);
    const image = screen.getByRole('img');
    fireEvent.error(image);

    expect(image.parentElement).toHaveAttribute('data-loading', 'false');
    expect(image).toHaveAttribute('alt', 'Recipe');
    expect(image).toHaveClass('opacity-100');
  });

  it('does not lazy load the priority image', () => {
    render(<RecipeImage src='/today.jpg' alt='Today' sizes='288px' priority />);
    expect(screen.getByRole('img')).not.toHaveAttribute('loading', 'lazy');
  });
});
