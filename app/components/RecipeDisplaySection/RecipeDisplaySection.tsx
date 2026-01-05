'use client';

import { useState, useMemo } from 'react';

import { useDisclosure } from '@heroui/use-disclosure';
import { Pagination } from '@heroui/pagination';
import { SearchAndFilterBar } from '@/components/SearchAndFilterBar';
import { RecipeFilterDrawer } from './RecipeFilterDrawer';
import { RecipeCard } from '@/components/RecipeCard';
import { Recipe } from '@/data/recipe';
import { matchRecipe, matchCategory } from '@/utils';
import { ITEMS_PER_PAGE } from '@/constants';
import _ from 'lodash';

interface RecipeDisplaySectionProps {
  recipeList: Recipe[];
}

export function RecipeDisplaySection({
  recipeList,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [categoryValue, setCategoryValue] = useState(new Set<string>([]));
  const [currentPage, setCurrentPage] = useState(1);

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

    return result;
  }, [recipeList, appliedSearchText, categoryValue]);

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
      />
      <RecipeFilterDrawer isOpen={isOpen} onOpenChange={onOpenChange} />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredRecipeList
          .slice(
            (currentPage - 1) * ITEMS_PER_PAGE,
            currentPage * ITEMS_PER_PAGE,
          )
          .map((recipeData) => {
            const { name } = recipeData;
            return <RecipeCard key={`${name}-card`} recipeData={recipeData} />;
          })}
      </div>
      {filteredRecipeList.length > ITEMS_PER_PAGE ? (
        <Pagination
          className='mx-auto'
          color='secondary'
          page={currentPage}
          total={Math.ceil(filteredRecipeList.length / ITEMS_PER_PAGE)}
          onChange={setCurrentPage}
        />
      ) : null}
    </div>
  );
}
