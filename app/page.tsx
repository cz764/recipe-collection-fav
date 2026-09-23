import { Suspense } from 'react';
import { RecipeLoader } from '@/components/RecipeLoader';
import { FeaturedRecipeLoader } from '@/components/FeaturedRecipeLoader';
import { Divider } from '@heroui/divider';
import {
  FeaturedRecipesLoadingSkeleton,
  RecipeResultsLoadingSkeleton,
} from '@/components/RecipeLoadingSkeleton';
import type { RecipeSearchParams } from '@/data/filter';

interface HomeProps {
  searchParams: Promise<RecipeSearchParams>;
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;

  return (
    <div className='flex w-full min-w-0 flex-col gap-4'>
      <Suspense fallback={<FeaturedRecipesLoadingSkeleton />}>
        <FeaturedRecipeLoader />
      </Suspense>
      <Divider />
      <Suspense
        key={JSON.stringify([
          params.cuisine,
          params.meal,
          params.type,
          params.q,
        ])}
        fallback={<RecipeResultsLoadingSkeleton />}
      >
        <RecipeLoader searchParams={params} />
      </Suspense>
    </div>
  );
}
