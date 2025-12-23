import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Footer from '..';

describe('Footer', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText('@Chen Zhu. All rights reserved.')).toBeVisible();
  });

  it('renders as a footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });
});
