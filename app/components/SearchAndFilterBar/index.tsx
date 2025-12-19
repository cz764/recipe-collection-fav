import { Button } from '@heroui/button';
import { Link } from '@heroui/link';
import { Input } from '@heroui/input';
import CategorySelect from './CategorySelect';
import SearchIcon from '@/components/Icons/SearchIcon';
import FilterIcon from '@/components/Icons/FilterIcon';

export default function SearchAndFilterBar() {
  return (
    <div className='flex flex-col gap-1'>
      <div className='mt-4 flex justify-between'>
        <div className='flex w-xl items-center gap-6'>
          <Input
            className='w-sm'
            label='Search'
            size='sm'
            endContent={<SearchIcon className='pointer-events-none size-6' />}
          />

          <Button
            isIconOnly
            aria-label='Filter'
            color='primary'
            variant='faded'
          >
            <FilterIcon className='size-6' />
          </Button>
          <CategorySelect />
        </div>
        <Button as={Link} color='primary' href='/add'>
          Add
        </Button>
      </div>
      <div className='flex justify-between'>
        <div className='flex gap-4'>
          <p>Filter item1</p>
          <p>Filter item2</p>
        </div>
        <p className='text-gray-700'>20 recipes</p>
      </div>
    </div>
  );
}
