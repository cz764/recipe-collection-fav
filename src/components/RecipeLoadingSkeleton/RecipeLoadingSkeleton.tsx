import { FeaturedRecipesLoadingSkeleton } from './FeaturedRecipesLoadingSkeleton';
import { RecipeResultsLoadingSkeleton } from './RecipeResultsLoadingSkeleton';

export function RecipeLoadingSkeleton() {
  return (
    <div className='flex w-full min-w-0 flex-col gap-4'>
      <FeaturedRecipesLoadingSkeleton />
      <div className='bg-divider h-px w-full' />
      <RecipeResultsLoadingSkeleton />
    </div>
  );
}
