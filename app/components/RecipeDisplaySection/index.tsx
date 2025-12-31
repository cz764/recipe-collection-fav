'use client';

import { useState, useCallback, useMemo } from 'react';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/data/recipe';
import { matchRecipe, matchCategory } from '@/utils';
import _ from 'lodash';

interface RecipeDisplaySectionProps {
  recipeList: Recipe[];
}

export default function RecipeDisplaySection({
  recipeList,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');
  const [categoryValue, setCategoryValue] = useState(new Set<string>([]));

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
    <div>
      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
        onSearch={applySearch}
        totalRecipes={filteredRecipeList.length}
        onCategoryChange={setCategoryValue}
      />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {filteredRecipeList.map((recipeData) => {
          const { name } = recipeData;
          return <RecipeCard key={`${name}-card`} recipeData={recipeData} />;
        })}
      </div>
    </div>
  );
}
