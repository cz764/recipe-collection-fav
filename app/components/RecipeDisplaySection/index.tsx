'use client';

import SearchAndFilterBar from '@/components/SearchAndFilterBar';
import RecipeCard from '@/components/RecipeCard';
import { Recipe } from '@/data/recipe';
import { useState } from 'react';

interface RecipeDisplaySectionProps {
  recipeList: Recipe[];
}

export default function RecipeDisplaySection({
  recipeList,
}: RecipeDisplaySectionProps) {
  const [searchText, setSearchText] = useState('');

  console.log(searchText);
  return (
    <div>
      <SearchAndFilterBar
        searchText={searchText}
        onSearchTextChange={setSearchText}
      />
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {recipeList.map((recipeData) => {
          const { name } = recipeData;
          return <RecipeCard key={`${name}-card`} recipeData={recipeData} />;
        })}
      </div>
    </div>
  );
}
