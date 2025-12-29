import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';
import CategorySelect from '@/components/CategorySelect';
import SearchIcon from '@/components/Icons/SearchIcon';
import FilterIcon from '@/components/Icons/FilterIcon';

interface SearchAndFilterBarProps {
  searchText: string;
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

export default function SearchAndFilterBar({
  searchText,
  onSearchTextChange,
  onSearch,
}: SearchAndFilterBarProps) {
  return (
    <div className='flex flex-col gap-1'>
      <div className='flex justify-between'>
        <div className='flex w-xl items-center gap-6'>
          <Input
            isClearable
            className='max-w-sm'
            aria-label='Search Input'
            size='sm'
            maxLength={100}
            value={searchText}
            onValueChange={onSearchTextChange}
            startContent={
              <Button
                isIconOnly
                aria-label='Search'
                variant={'light'}
                onPress={onSearch}
              >
                <SearchIcon className='pointer-events-none size-6' />
              </Button>
            }
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                onSearch();
              }
            }}
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
        <p className='text-gray-700'>5 recipes</p>
      </div>
    </div>
  );
}
