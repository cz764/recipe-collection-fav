import { Suspense } from 'react';
import { RecipeLoader } from '@/components/RecipeLoader';
import { RecipeLoadingSkeleton } from '@/components/RecipeLoadingSkeleton';
import type { RecipeSearchParams } from '@/data/filter';

interface HomeProps {
  searchParams: Promise<RecipeSearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <div className='flex w-full min-w-0 flex-col gap-4'>
      <Suspense
        key={JSON.stringify([params.cuisine, params.meal, params.type])}
        fallback={<RecipeLoadingSkeleton />}
      >
        <RecipeLoader searchParams={params} />
      </Suspense>
    </div>
  );
}
