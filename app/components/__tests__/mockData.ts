import type { Recipe } from '@/data/recipe';

export function makeRecipe(overrides: Partial<Recipe> = {}): Recipe {
  return {
    id: '1',
    name: 'Test Recipe',
    description: 'A delicious test recipe with amazing flavors',
    tags: ['Quick', 'Easy', 'Vegetarian'],
    source: 'https://example.com',
    language: 'en',
    totalTime: 30,
    yieldServings: 4,
    equipments: ['Pan', 'Knife'],
    cuisine: 'Italian',
    type: 'dinner',
    ingredients: [
      { name: 'Tomato', amount: 2, unit: 'pieces' },
      { name: 'Garlic', amount: 3, unit: 'cloves' },
      { name: 'Olive Oil', amount: 2, unit: 'tbsp' },
    ],
    pictureUrl: '/test-image.jpg',
    steps: {
      prep: ['Wash vegetables', 'Chop ingredients'],
      steps: [{ detail: 'Cook everything together' }],
    },
    ...overrides,
  };
}
