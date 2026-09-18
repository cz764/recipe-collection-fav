import { Suspense } from 'react';
import { RecipeLoader } from '@/components/RecipeLoader';
import { RecipeLoadingSkeleton } from '@/components/RecipeLoadingSkeleton';

export default async function Home() {
  return (
    <div className='flex w-full min-w-0 flex-col gap-4'>
      <Suspense fallback={<RecipeLoadingSkeleton />}>
        <RecipeLoader />
      </Suspense>
    </div>
  );
}
