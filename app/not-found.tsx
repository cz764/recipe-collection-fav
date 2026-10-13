import { Link } from '@heroui/link';

export default function NotFound() {
  return (
    <div className='flex min-h-96 flex-col items-center justify-center gap-4 text-center'>
      <h2 className='text-2xl font-semibold'>Page not found</h2>
      <p className='text-gray-600'>There is nothing at this address.</p>
      <Link href='/'>Back to all recipes</Link>
    </div>
  );
}
