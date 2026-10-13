/** Type guard for membership in one of the readonly recipe vocabularies. */
export const isOneOf = <T extends string>(
  values: readonly T[],
  value: unknown,
): value is T => typeof value === 'string' && values.includes(value as T);
