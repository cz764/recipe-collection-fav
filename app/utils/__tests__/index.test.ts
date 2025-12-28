import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { randomRecipeIndexFromDate } from '../index';

describe('randomRecipeIndexFromDate', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns an index within bounds of array length', () => {
    const arrayLength = 5;
    const result = randomRecipeIndexFromDate(arrayLength);
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThan(arrayLength);
  });

  it('returns the same index for the same date', () => {
    vi.setSystemTime(new Date('2025-12-16'));

    const arrayLength = 10;
    const result1 = randomRecipeIndexFromDate(arrayLength);
    const result2 = randomRecipeIndexFromDate(arrayLength);

    expect(result1).toEqual(result2);
  });

  it('returns different indices for different dates', () => {
    const arrayLength = 10;

    vi.setSystemTime(new Date('2025-06-15'));
    const result1 = randomRecipeIndexFromDate(arrayLength);

    vi.setSystemTime(new Date('2025-06-16'));
    const result2 = randomRecipeIndexFromDate(arrayLength);

    expect(result1).not.toEqual(result2);
  });

  it('handles array length of 1', () => {
    const result = randomRecipeIndexFromDate(1);
    expect(result).toEqual(0);
  });

  it('computes index correctly based on day of year', () => {
    vi.setSystemTime(new Date('2025-03-10')); // day 68 of year

    const arrayLength = 7;
    // Expected: 68 % 7 = 5
    const result = randomRecipeIndexFromDate(arrayLength);
    expect(result).toEqual(5);
  });
});
