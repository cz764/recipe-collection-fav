/**
 * Tests whether all items in a Set satisfy the provided predicate.
 * Similar to Array.prototype.every() but for Sets.
 * @param set - The Set to iterate over
 * @param predicate - Function to test each item
 * @returns true if all items pass the test, false otherwise
 */
export const everySet = (
  set: Set<string>,
  predicate: (item: string) => boolean,
) => {
  for (const item of set) {
    if (!predicate(item)) {
      return false; // Stops iterating immediately if condition fails
    }
  }
  return true; // All items satisfied the condition
};

/**
 * Generates a deterministic recipe index based on the current day of the year.
 * Returns the same index for the same date, useful for "recipe of the day" features.
 * @param srcArrayLength - Length of the recipe array to index into
 * @returns An index between 0 and srcArrayLength - 1
 */
export const randomRecipeIndexFromDate = (srcArrayLength: number): number => {
  const date = new Date();
  const startOfYear = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  return dayOfYear % srcArrayLength;
};

/**
 * Parses a delimited category selection string into a Set.
 * Used to handle HeroUI Select's onChange event value.
 * @param value - Delimited string of selected category keys
 * @param limit - Maximum number of categories allowed
 * @param delimiter - Delimiter used to split the string (default: ',')
 * @returns Set of categories, or null if selection exceeds limit
 */
export const parseCategorySelection = (
  value: string,
  limit: number,
  delimiter: string = ',',
): Set<string> | null => {
  if (!value) {
    return new Set();
  }

  const categories = value.split(delimiter);
  if (categories.length > limit) {
    return null;
  }

  return new Set(categories);
};
