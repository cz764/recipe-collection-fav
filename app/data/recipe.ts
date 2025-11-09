export interface Recipe {
  id: string;
  name: string; // max: 40
  description: string; // max: 200
  tags: string[];
  source: string;
  language: "en" | "ch";
  totalTime: number; // in min
  yieldServings: number; // in serving
  equipments: string[];
  cuisine: string;
  ingredients: Ingredient[];
  pictureUrl: string;
  steps: {
    prep: string[];
    steps: Step[];
  };
  createdAt?: Date;
  updatedAt?: Date;
  authorId?: string;
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
