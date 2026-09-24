import { Suspense } from 'react';
import { hasRecipeFilters } from '@/utils/searchParams';
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
  const showFeatured = !hasRecipeFilters(params);

  return (
    <div className='flex w-full min-w-0 flex-col gap-4'>
      {showFeatured && (
        <>
          <Suspense fallback={<FeaturedRecipesLoadingSkeleton />}>
            <FeaturedRecipeLoader />
          </Suspense>
          <Divider />
        </>
      )}
      <Suspense
        key={JSON.stringify([
          params.cuisine,
          params.meal,
          params.type,
          params.q,
          params.tag,
        ])}
        fallback={<RecipeResultsLoadingSkeleton />}
      >
        <RecipeLoader searchParams={params} />
      </Suspense>
    </div>
  );
}
