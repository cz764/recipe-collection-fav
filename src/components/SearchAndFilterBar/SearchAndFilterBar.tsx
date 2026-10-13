import { Chip } from '@heroui/chip';
import { SearchInput } from './SearchInput';
import type { RecipeQuery } from '@/data/filter';
import { titleCase } from '@/utils/labels';

export type RecipeFilterKey = keyof RecipeQuery;

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  /** Removes one URL filter; chips are read-only summaries when omitted. */
  onRemoveFilter?: (key: RecipeFilterKey) => void;
  totalRecipes: number;
  urlFilters?: RecipeQuery;
}

/** Search text keeps the user's casing; vocabulary values are title-cased. */
const filterLabel = (key: RecipeFilterKey, value: string) =>
  key === 'q' ? `Search: ${value}` : `${titleCase(key)}: ${titleCase(value)}`;

export function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearch,
  onRemoveFilter,
  totalRecipes,
  urlFilters = {},
}: SearchAndFilterBarProps) {
  const activeFilters = (
    Object.entries(urlFilters) as [RecipeFilterKey, string | undefined][]
  ).filter((entry): entry is [RecipeFilterKey, string] => Boolean(entry[1]));

  return (
    <div className='flex flex-col gap-2'>
      <div className='flex justify-between'>
        <div className='w-full'>
          <SearchInput
            searchText={searchText}
            onSearchTextChange={onSearchTextChange}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex min-w-0 flex-1 flex-wrap gap-2'>
          {activeFilters.map(([key, value]) => (
            <Chip
              key={`url-${key}`}
              size='sm'
              variant='flat'
              color='secondary'
              classNames={{ content: 'max-w-full break-words' }}
              onClose={onRemoveFilter && (() => onRemoveFilter(key))}
            >
              {filterLabel(key, value)}
            </Chip>
          ))}
        </div>
        <p className='shrink-0 whitespace-nowrap text-gray-600'>
          {totalRecipes <= 1
            ? `${totalRecipes} recipe`
            : `${totalRecipes} recipes`}
        </p>
      </div>
    </div>
  );
}
