import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { SearchInput } from './SearchInput';
import { CategorySelect } from '@/components/SearchAndFilterBar/CategorySelect';
import FilterIcon from '@/components/Icons/FilterIcon';
import { FilterMap } from '@/data/filter';

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  totalRecipes: number;
  onCategoryChange: React.Dispatch<React.SetStateAction<Set<string>>>;
  onOpenFilter: () => void;
  filterMap: FilterMap;
}

export function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearch,
  totalRecipes,
  onCategoryChange,
  onOpenFilter,
  filterMap,
}: SearchAndFilterBarProps) {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex justify-between'>
        <div className='flex w-full max-w-xl flex-col items-center gap-6 lg:flex-row'>
          <SearchInput
            searchText={searchText}
            onSearchTextChange={onSearchTextChange}
            onSearch={onSearch}
          />
          <Button
            isIconOnly
            aria-label='Open Filters'
            color='primary'
            variant='faded'
            onPress={onOpenFilter}
          >
            <FilterIcon className='size-6' />
          </Button>
          <CategorySelect onCategoryChange={onCategoryChange} />
        </div>
      </div>
      <div className='flex items-start justify-between gap-4'>
        <div className='flex min-w-0 flex-1 flex-wrap gap-x-4 gap-y-1'>
          {[...filterMap.keys()].map((filterBy) => (
            <p
              key={`${filterBy}`}
              className='max-w-full min-w-0 break-words'
            >{`${filterBy}: ${filterMap.get(filterBy)}`}</p>
          ))}
        </div>
        <p className='shrink-0 whitespace-nowrap text-gray-600'>
          {totalRecipes} recipes
        </p>
      </div>
    </div>
  );
}
