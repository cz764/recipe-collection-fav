export interface Recipe {
  id: string;
  name: string; // max: 40
  description: string; // max: 200
  tags: string[];
  source: string;
  language: "en" | "ch";
  totalTime: string;
  yield: string;
  equipments: string[];
  cruisine: string;
  ingredients: string[];
  picture: string;
  steps: {
    prep: string[];
    steps: Step[];
  };
}

export interface Step {
  detail: string;
  image?: string;
}
