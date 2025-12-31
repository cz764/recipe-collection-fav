import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import SearchInput from './SearchInput';
import CategorySelect from '@/components/SearchAndFilterBar/CategorySelect';
import FilterIcon from '@/components/Icons/FilterIcon';

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
  totalRecipes: number;
}

export default function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearch,
  totalRecipes,
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
          >
            <FilterIcon className='size-6' />
          </Button>
          <CategorySelect />
        </div>
        <Button as={Link} area-label='Add Recipe' color='primary' href='/add'>
          Add
        </Button>
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-4'>
          <p>Filter item1</p>
          <p>Filter item2</p>
        </div>
        <p className='text-gray-600'>{totalRecipes} recipes</p>
      </div>
    </div>
  );
}
