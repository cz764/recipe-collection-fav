import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import {
  everySet,
  randomRecipeIndexFromDate,
  parseCategorySelection,
} from '../index';

describe('everySet', () => {
  it('returns true for empty set', () => {
    const result = everySet(new Set(), () => false);
    expect(result).toBe(true);
  });

  it('returns true when all items satisfy predicate', () => {
    const set = new Set(['apple', 'apricot', 'avocado']);
    const result = everySet(set, (item) => item.startsWith('a'));
    expect(result).toBe(true);
  });

  it('returns false when one item fails predicate', () => {
    const set = new Set(['apple', 'banana', 'avocado']);
    const result = everySet(set, (item) => item.startsWith('a'));
    expect(result).toBe(false);
  });

  it('returns false when all items fail predicate', () => {
    const set = new Set(['banana', 'cherry', 'date']);
    const result = everySet(set, (item) => item.startsWith('a'));
    expect(result).toBe(false);
  });

  it('stops iterating on first failure', () => {
    const set = new Set(['apple', 'banana', 'cherry']);
    const predicateMock = vi.fn((item: string) => item.startsWith('a'));
    everySet(set, predicateMock);
    expect(predicateMock).toHaveBeenCalledTimes(2);
  });

  it('works with single item set', () => {
    const setPass = new Set(['apple']);
    const setFail = new Set(['banana']);
    expect(everySet(setPass, (item) => item.startsWith('a'))).toBe(true);
    expect(everySet(setFail, (item) => item.startsWith('a'))).toBe(false);
  });
});

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

describe('parseCategorySelection', () => {
  const LIMIT = 3;
  const DELIMITER = ',';

  it('returns empty Set for empty string', () => {
    const result = parseCategorySelection('', LIMIT, DELIMITER);
    expect(result).toEqual(new Set());
  });

  it('returns empty Set for falsy value', () => {
    const result = parseCategorySelection(
      undefined as unknown as string,
      LIMIT,
      DELIMITER,
    );
    expect(result).toEqual(new Set());
  });

  it('returns Set with single category', () => {
    const result = parseCategorySelection('chinese', LIMIT, DELIMITER);
    expect(result).toEqual(new Set(['chinese']));
  });

  it('returns Set with multiple categories within limit', () => {
    const result = parseCategorySelection('chinese,italian', LIMIT, DELIMITER);
    expect(result).toEqual(new Set(['chinese', 'italian']));
  });

  it('returns Set when exactly at limit', () => {
    const result = parseCategorySelection(
      'chinese,italian,breakfast',
      LIMIT,
      DELIMITER,
    );
    expect(result).toEqual(new Set(['chinese', 'italian', 'breakfast']));
  });

  it('returns null when exceeding limit', () => {
    const result = parseCategorySelection(
      'chinese,italian,breakfast,healthy',
      LIMIT,
      DELIMITER,
    );
    expect(result).toBeNull();
  });

  it('uses default comma delimiter when not specified', () => {
    const result = parseCategorySelection('chinese,italian', LIMIT);
    expect(result).toEqual(new Set(['chinese', 'italian']));
  });

  it('works with custom delimiter', () => {
    const result = parseCategorySelection(
      'chinese|italian|breakfast',
      LIMIT,
      '|',
    );
    expect(result).toEqual(new Set(['chinese', 'italian', 'breakfast']));
  });
});
