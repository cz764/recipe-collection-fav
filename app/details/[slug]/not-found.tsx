import { Link } from '@heroui/link';

export default function RecipeNotFound() {
  return (
    <div className='flex min-h-96 flex-col items-center justify-center gap-4 text-center'>
      <h2 className='text-2xl font-semibold'>Recipe not found</h2>
      <p className='text-gray-600'>
        This recipe does not exist or may have been removed.
      </p>
      <Link href='/'>Back to all recipes</Link>
    </div>
  );
}
