'use client';

import { useState, useMemo } from 'react';

import { useDisclosure } from '@heroui/use-disclosure';
import { Pagination } from '@heroui/pagination';
import { SearchAndFilterBar } from '@/components/SearchAndFilterBar';
import { RecipeFilterDrawer } from './RecipeFilterDrawer';
import { RecipeCard } from '@/components/RecipeCard';
import type { Recipe } from '@/data/recipe';
import type { FilterMap, RecipeQuery } from '@/data/filter';
import { matchRecipe, matchCategory, matchFilters } from '@/utils';
import { ITEMS_PER_PAGE } from '@/constants';
import _ from 'lodash';

interface RecipeDisplaySectionProps {
  recipeList: Recipe[];
  urlFilters?: RecipeQuery;
}

export function RecipeDisplaySection({
  recipeList,
  urlFilters,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [categoryValue, setCategoryValue] = useState(new Set<string>([]));
  const [currentPage, setCurrentPage] = useState(1);
  const [filterMap, setFilterMap] = useState<FilterMap>(new Map());

  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const filteredRecipeList = useMemo(() => {
    let result = recipeList;

    if (appliedSearchText.trim()) {
      result = result.filter((recipe) =>
        matchRecipe(recipe, appliedSearchText.trim()),
      );
    }

    if (!_.isEmpty(categoryValue)) {
      result = result.filter((recipe) => matchCategory(recipe, categoryValue));
    }

    if (!_.isEmpty(filterMap)) {
      result = result.filter((recipe) => matchFilters(recipe, filterMap));
    }

    return result;
  }, [recipeList, appliedSearchText, categoryValue, filterMap]);

  const applySearch = () => {
    setAppliedSearchText(searchText);
  };

  return (
    <div className='flex flex-col gap-2'>
      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearch={applySearch}
        totalRecipes={filteredRecipeList.length}
        onCategoryChange={setCategoryValue}
        onOpenFilter={onOpen}
        urlFilters={urlFilters}
      />
      <RecipeFilterDrawer
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        onDrawerAction={setFilterMap}
      />
      <div className='grid min-h-96 grid-cols-1 content-start gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredRecipeList.length === 0 ? (
          <p
            role='status'
            className='col-span-full flex min-h-96 items-center justify-center text-gray-600'
          >
            No recipes found.
          </p>
        ) : (
          filteredRecipeList
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
        {filteredRecipeList.length > ITEMS_PER_PAGE ? (
          <Pagination
            color='secondary'
            page={currentPage}
            total={Math.ceil(filteredRecipeList.length / ITEMS_PER_PAGE)}
            onChange={setCurrentPage}
          />
        ) : null}
      </div>
    </div>
  );
}
