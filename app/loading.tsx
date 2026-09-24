'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import {
  RecipeLoadingSkeleton,
  RecipeResultsLoadingSkeleton,
} from '@/components/RecipeLoadingSkeleton';
import { hasRecipeFilters } from '@/utils/searchParams';
import type { RecipeSearchParams } from '@/data/filter';

function LoadingContent() {
  const searchParams = useSearchParams();
  const params: RecipeSearchParams = {};
  // Preserve repeated values so visibility agrees with the server parser.
  searchParams.forEach((_, key) => {
    params[key] = searchParams.getAll(key);
  });
  return hasRecipeFilters(params) ? (
    <RecipeResultsLoadingSkeleton />
  ) : (
    <RecipeLoadingSkeleton />
  );
}

export default function Loading() {
  return (
    <Suspense fallback={<RecipeResultsLoadingSkeleton />}>
      <LoadingContent />
    </Suspense>
  );
}
