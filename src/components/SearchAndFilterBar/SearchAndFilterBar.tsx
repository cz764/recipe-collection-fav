import { SearchInput } from './SearchInput';
import type { RecipeQuery } from '@/data/filter';

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  totalRecipes: number;
  urlFilters?: RecipeQuery;
}

export function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearch,
  totalRecipes,
  urlFilters = {},
}: SearchAndFilterBarProps) {
  return (
    <div className='flex flex-col gap-1'>
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
        <div className='flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-1'>
          {Object.entries(urlFilters)
            .filter(([, value]) => value)
            .map(([filterBy, value]) => (
              <p
                key={`url-${filterBy}`}
                className='max-w-full min-w-0 break-words'
              >{`${filterBy === 'q' ? 'Search' : filterBy}: ${value}`}</p>
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
