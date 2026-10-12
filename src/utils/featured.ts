export const FEATURED_RECIPE_COUNT = 3;

/** Small deterministic PRNG so a date seed always yields the same sequence. */
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

/** Seed from the local calendar date, so the selection only changes with the day. */
const dateSeed = (date: Date) =>
  date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate();

/**
 * Picks up to `count` distinct recipes for the given local calendar date.
 * The same date and collection always produce the same picks, in the same order.
 * @param recipes - The full collection to choose from
 * @param date - The local date to seed the selection with (defaults to now)
 * @param count - Maximum number of recipes to pick
 */
export function selectFeaturedRecipes<T>(
  recipes: readonly T[],
  date: Date = new Date(),
  count: number = FEATURED_RECIPE_COUNT,
): T[] {
  const random = mulberry32(dateSeed(date));
  const pool = [...recipes];
  const picked: T[] = [];
  while (pool.length > 0 && picked.length < count) {
    const index = Math.floor(random() * pool.length);
    picked.push(pool.splice(index, 1)[0]);
  }
  return picked;
}
