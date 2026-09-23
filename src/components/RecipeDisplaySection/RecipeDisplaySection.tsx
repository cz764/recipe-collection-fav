'use client';

import { useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';

import { Pagination } from '@heroui/pagination';
import { SearchAndFilterBar } from '@/components/SearchAndFilterBar';
import { RecipeCard } from '@/components/RecipeCard';
import type { Recipe } from '@/data/recipe';
import type { RecipeQuery } from '@/data/filter';
import { ITEMS_PER_PAGE } from '@/constants';

interface RecipeDisplaySectionProps {
  recipeList: Recipe[];
  urlFilters?: RecipeQuery;
}

export function RecipeDisplaySection({
  recipeList,
  urlFilters,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState(urlFilters?.q ?? '');
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
        totalRecipes={recipeList.length}
        urlFilters={urlFilters}
      />
      <div className='grid min-h-96 grid-cols-1 content-start gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {recipeList.length === 0 ? (
          <p
            role='status'
            className='col-span-full flex min-h-96 items-center justify-center text-gray-600'
          >
            No recipes found.
          </p>
        ) : (
          recipeList
            .slice(
              (currentPage - 1) * ITEMS_PER_PAGE,
              currentPage * ITEMS_PER_PAGE,
            )
            .map((recipeData) => {
              const { name } = recipeData;
              return (
                <RecipeCard key={`${name}-card`} recipeData={recipeData} />
              );
            })
        )}
      </div>
      <div className='flex min-h-10 justify-center'>
        {recipeList.length > ITEMS_PER_PAGE ? (
          <Pagination
            color='secondary'
            page={currentPage}
            total={Math.ceil(recipeList.length / ITEMS_PER_PAGE)}
            onChange={setCurrentPage}
          />
        ) : null}
      </div>
    </div>
  );
}
