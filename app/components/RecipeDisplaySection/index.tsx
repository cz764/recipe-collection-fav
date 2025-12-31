'use client';

import { useState, useCallback, useMemo } from 'react';
import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/data/recipe';
import { matchRecipe } from '@/utils';

interface RecipeDisplaySectionProps {
  recipeList: Recipe[];
}

export default function RecipeDisplaySection({
  recipeList,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState('');
  const [appliedSearchText, setAppliedSearchText] = useState('');

  const filteredRecipeList = useMemo(() => {
    if (!appliedSearchText.trim()) return recipeList;

    return recipeList.filter((recipe) =>
      matchRecipe(recipe, appliedSearchText),
    );
  }, [recipeList, appliedSearchText]);

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
