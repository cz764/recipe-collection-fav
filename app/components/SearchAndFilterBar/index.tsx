import { Button } from '@heroui/button';
import { Link } from '@heroui/link';

export default function SearchAndFilterBar() {
  return (
    <div className='flex gap-6'>
      <div>Search</div>
      <div>filter icon</div>
      <div>Category select</div>
      <Button as={Link} color='primary' href='/add'>
        Add
      </Button>
    </div>
  );
}
