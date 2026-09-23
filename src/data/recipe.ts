import type {
  CUISINES,
  MEAL_TYPES,
  TYPE_COLLECTIONS,
  RECIPE_TAGS,
} from '@/constants/recipe';

export type Cuisine = (typeof CUISINES)[number];
export type MealType = (typeof MEAL_TYPES)[number];
export type TypeCollection = (typeof TYPE_COLLECTIONS)[number];
export type RecipeTag = (typeof RECIPE_TAGS)[number];

export interface Recipe {
  id: string;
  name: string; // max: 40
  description: string; // max: 200
  tags: RecipeTag[];
  source: string;
  language: 'en' | 'ch';
  totalTime: number; // in min
  yieldServings: number; // in serving
  equipments: string[];
  cuisine: Cuisine;
  meal: MealType;
  type: TypeCollection[];
  ingredients: Ingredient[];
  pictureUrl: string;
  steps: {
    prep: string[];
    steps: Step[];
  };
  createdAt?: Date;
  updatedAt?: Date;
  authorId?: string;
  creditTo?: string;
}

export interface Step {
  detail: string;
  imageUrl?: string;
}

export interface Ingredient {
  name: string;
  amount: number | string;
  unit?: string;
}
