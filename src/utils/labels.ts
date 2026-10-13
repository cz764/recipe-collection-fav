/** Turns a dashed vocabulary value such as `latin-american` into `Latin American`. */
export const titleCase = (value: string): string =>
  value
    .split('-')
    .map((word) => (word ? word[0].toUpperCase() + word.slice(1) : word))
    .join(' ');
