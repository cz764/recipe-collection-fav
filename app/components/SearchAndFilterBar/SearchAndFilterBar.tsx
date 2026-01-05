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
        <div className='flex w-xl items-center gap-6'>
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
        <Button as={Link} area-label='Add Recipe' color='primary' href='/add'>
          Add
        </Button>
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-4'>
          {[...filterMap.keys()].map((filterBy) => (
            <p
              key={`${filterBy}`}
            >{`${filterBy}: ${filterMap.get(filterBy)}`}</p>
          ))}
        </div>
        <p className='text-gray-600'>{totalRecipes} recipes</p>
      </div>
    </div>
  );
}
