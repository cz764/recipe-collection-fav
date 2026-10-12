'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Button } from '@heroui/button';
import { SearchAndFilterBar } from '@/components/SearchAndFilterBar';
import { RecipeCard } from '@/components/RecipeCard';
import type { RecipePage, RecipeQuery } from '@/data/filter';
import { useRecipePages } from '@/hooks/useRecipePages';

interface RecipeDisplaySectionProps {
  initialPage: RecipePage;
  urlFilters?: RecipeQuery;
}

export function RecipeDisplaySection({
  initialPage,
  urlFilters,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState(urlFilters?.q ?? '');
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { recipes, total, hasMore, status, autoLoadExhausted, loadMore } =
    useRecipePages(initialPage, urlFilters);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Scrolling near the Load more control fetches the next page automatically.
  // The button stays available, so the list still works without the observer.
  const autoLoad = hasMore && !autoLoadExhausted && status === 'idle';
  useEffect(() => {
    const target = loadMoreRef.current;
    if (!autoLoad || !target || typeof IntersectionObserver === 'undefined') {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) loadMore('auto');
      },
      { rootMargin: '200px 0px' },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [autoLoad, loadMore]);

  const applySearch = () => {
    const params = new URLSearchParams(searchParams.toString());
    const query = searchText.trim();
    if (query) params.set('q', query);
    else params.delete('q');
    const queryString = params.toString();
    router.push(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  };

  return (
    <div className='flex flex-col gap-2'>
      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearch={applySearch}
        totalRecipes={total}
        urlFilters={urlFilters}
      />
      <div className='grid min-h-96 grid-cols-1 content-start gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {recipes.length === 0 ? (
          <p
            role='status'
            className='col-span-full flex min-h-96 items-center justify-center text-gray-600'
          >
            No recipes found.
          </p>
        ) : (
          recipes.map((recipeData) => (
            <RecipeCard key={`${recipeData.id}-card`} recipeData={recipeData} />
          ))
        )}
      </div>
      <div
        ref={loadMoreRef}
        className='flex min-h-10 flex-col items-center justify-center gap-2'
      >
        {status === 'error' ? (
          <p role='alert' className='text-danger text-sm'>
            Could not load more recipes.
          </p>
        ) : null}
        {hasMore ? (
          <Button
            color='secondary'
            variant='flat'
            isLoading={status === 'loading'}
            onPress={() => loadMore('manual')}
          >
            {status === 'loading' ? 'Loading more recipes' : 'Load more'}
          </Button>
        ) : null}
      </div>
    </div>
  );
}
