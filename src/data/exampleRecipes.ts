import type { Recipe } from './recipe';

export const exampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Sourdough',
    description:
      'European style sourdough that does not require a starter. Instead, we develop the flavor by using "Poolish". Perfect slice can be used to make sandwich, or just spread some butter!',
    tags: ['vegetarian', 'european', 'breakfast', 'lunch'],
    source: 'https://youtu.be/5mehXzl7yHA?si=8y-2iZecgYxvN1kM',
    language: 'en',
    totalTime: 120,
    yieldServings: 5,
    equipments: ['oven', 'mixing bowl', 'scale', 'bread basket'],
    cuisine: 'European',
    creditTo: 'Brian Lagerstrom',
    type: 'breakfast',
    ingredients: [
      { name: 'bread flour', amount: 100, unit: 'g' },
      { name: 'water', amount: 100, unit: 'g' },
      { name: 'warm water', amount: 187, unit: 'g' },
      { name: 'yeast', amount: '1/2', unit: 'tsp' },
      { name: 'bread flour', amount: 233, unit: 'g' },
      { name: 'whole wheat flour', amount: 33, unit: 'g' },
      { name: 'almond flour or oats(Optional)', amount: 30, unit: 'g' },
      { name: 'salt', amount: 1, unit: 'tsp' },
    ],
    pictureUrl: '/exampleRecipes/Sourdough.jpg',
    steps: {
      prep: [
        'Mix 100g water and 100g flour together',
        'Let it sit for more than 4 hours',
      ],
      steps: [
        {
          detail: 'In a mixing bowl, add 187g warm water. Sprinkle the yeast.',
        },
        { detail: 'Add poolish we made above, swirl a little to loosen it.' },
        {
          detail:
            'Add 233g bread flour, 33g whole wheat flour, optional almond flour or oats. Add 6.7g salt.',
        },
        {
          detail: 'Mix to a shaggy dough.',
        },
        {
          detail:
            'Set 30min timer to let the dough sit. Then shape and layer the gluten. Let sit for another 30min.',
        },
        {
          detail:
            'Shape and layer the gluten again. This round can be done the day before. Then put the dough to fridge until you are ready to bake it.',
        },
        {
          detail:
            'Flour the bread basket, shape and pinch the dough, gently drop the dough to bread basket, cover with cloth, let sit for 1hr.',
        },
        {
          detail: 'Preheat the oven to 500F, put the dutch oven in, for 45min.',
        },
        {
          detail:
            'Line a parchment paper, gently drop the dough to the parchment paper, lift it to put in the preheated dutch oven. Scorch the dough.',
        },
        { detail: 'Drop temperature to 485F, bake with lid on for 18min.' },
        { detail: 'Remove lid, bake another 25min.' },
        {
          detail:
            'Remove from the oven, put on baking cooling rack. You should be able to hear the bread still sizzling. That means success!',
        },
      ],
    },
  },
  {
    id: '2',
    name: 'Mexican Cheese Cornbread Biscuits',
    description:
      'I watched a video from Mike G on Youtube about this $50 budget meal prepping, this Mexican cheese cornbread caught my eye. It looks easy to make and delicious. It is between a dinner roll and biscuit. ',
    tags: ['mexican', 'dessert', 'dinner', 'bread'],
    source: 'https://www.youtube.com/watch?v=3Bhd6NcqVJI',
    language: 'en',
    totalTime: 50,
    yieldServings: 4,
    equipments: ['oven', '9 inch cast iron pan'],
    cuisine: 'Mexican',
    type: 'dinner',
    creditTo: 'LifebyMikeG',
    ingredients: [
      { name: 'sour cream', amount: 1, unit: 'cup' },
      { name: 'eggs', amount: 2 },
      { name: 'sugar', amount: '1/4', unit: 'cup' },
      { name: 'butter or oil', amount: 2, unit: 'tsp' },
      { name: 'corn kennel canned or frozen', amount: 1, unit: 'cup' },
      { name: 'corn juice or water', amount: '1/4', unit: 'cup' },
      { name: 'masa harina', amount: '2/3', unit: 'cup' },
      { name: 'baking soda', amount: '1/2', unit: 'tsp' },
      { name: 'baking powder', amount: 1, unit: 'tsp' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'shredded monterey jack cheese', amount: '1/2', unit: 'cup' },
      { name: 'finely diced jalapeno', amount: 1, unit: 'tsp' },
    ],
    pictureUrl: '/exampleRecipes/MexicanCornbread.png',
    steps: {
      prep: [],
      steps: [
        {
          detail:
            'To a large mixing bowl, add the sour cream, eggs, sugar, oil, corn, and the juice, mix well.',
        },
        {
          detail:
            'Add the masa harina, baking powder, baking soda, and salt. Whisk until combined.',
        },
        {
          detail:
            'Fold in the shredded cheese and the diced jalapeno. Let the batter sit for 5 - 10 mins to allow baking powder and soda to activate.',
        },
        {
          detail:
            'Preheat the cast iron pan on medium heat. Add butter, it should bubble but not burn.',
        },
        {
          detail:
            'Using a 1/2 cup ice cream scoop(optional), add the batter one scoop at a time until the pan is full or the batter is gone.',
        },
        {
          detail:
            'Place in the oven and bake at 400F for 30 - 40min, until golden brown and the interior reaches 210F.',
        },
        { detail: 'Let cool slightly and then remove from the pan.' },
      ],
    },
  },
  {
    id: '3',
    name: 'Chocolate Guinness Cake',
    description:
      "This is recipe inspired from New York Times, I had this cake at my mother-in-law's home once, and immediately fall in love with the flavor. Personally I prefer the cake without the topping, so I put it as optional.",
    tags: ['dessert', 'baking', 'cake', 'chocolate'],
    source: 'https://cooking.nytimes.com/recipes/1875-chocolate-guinness-cake',
    language: 'en',
    totalTime: 90,
    yieldServings: 12,
    equipments: ['mixing bowl', 'baking sheet', '9-inch cake pan', 'oven'],
    cuisine: 'American',
    creditTo: 'Nigella Lawson',
    type: 'dessert',
    ingredients: [
      { name: 'Guinness stout', amount: 1, unit: 'bottle' },
      { name: 'unsalted butter', amount: 1, unit: 'stick' },
      { name: 'unsweetened cocoa', amount: '3/4', unit: 'cup' },
      { name: 'superfine sugar', amount: '1 1/2', unit: 'cups' },
      { name: 'buttermilk', amount: '3/4', unit: 'cup' },
      { name: 'greek yogurt', amount: 2, unit: 'tbsp' },
      { name: 'large eggs', amount: 2 },
      { name: 'vanilla extract', amount: 1, unit: 'tbsp' },
      { name: 'all-purpose flour', amount: 2, unit: 'cups' },
      { name: 'baking soda', amount: '2 1/2', unit: 'tsp' },
      { name: 'salt', amount: '1', unit: 'pinch' },
    ],
    pictureUrl: '/exampleRecipes/GuinnesCake.webp',
    steps: {
      prep: [
        'Preheat oven to 350°F (180°C)',
        'Butter a 9-inch springform pan and line with parchment paper.',
      ],
      steps: [
        {
          detail:
            'For the cake: In a large saucepan, pour Guinness and bring to a boil. Reduce it to one cup. Then combine Guinness and butter. Place over medium-low heat until butter melts, then remove from heat.',
        },
        {
          detail: 'Add cocoa and superfine sugar, and whisk to blend.',
        },
        {
          detail:
            'In a small bowl, combine buttermilk, eggs and vanilla; mix well. Add to Guinness mixture.',
        },
        {
          detail:
            'Add flour and baking soda, a pinch of salt, and whisk again until smooth.',
        },
        {
          detail:
            'Pour batter into buttered pan, bake until risen and firm, about 45min or longer. Place pan on a wire rack and cool completely.',
        },
        {
          detail:
            'Optional topping: mix 1 1/4 cups of confectioner sugar, and 8 ounces room temperature cream cheese, until smooth. Add 1/2 cup heavy cream, mix until smooth and spreadable.Remove cake from pan, place on a cake stand. Ice top of cake only, so that it resembles a frothy pint of Guinness.',
        },
      ],
    },
  },
  {
    id: '4',
    name: 'Thai Green Curry',
    description:
      'Aromatic and creamy Thai curry with vegetables and your choice of protein. A perfect balance of spicy, sweet, and savory flavors.',
    tags: ['thai', 'curry', 'spicy', 'dinner', 'coconut', 'one-pot'],
    source: 'Thai Cooking Class',
    language: 'en',
    totalTime: 40,
    yieldServings: 4,
    equipments: ['large pot', 'knife', 'cutting board'],
    cuisine: 'Thai',
    type: 'dinner',
    ingredients: [
      { name: 'green curry paste', amount: 3, unit: 'tbsp' },
      { name: 'coconut milk', amount: 400, unit: 'ml' },
      { name: 'chicken breast', amount: 500, unit: 'g' },
      { name: 'bamboo shoots', amount: 1, unit: 'cup' },
      { name: 'bell peppers', amount: 2 },
      { name: 'Thai basil', amount: '1 handful' },
      { name: 'fish sauce', amount: 2, unit: 'tbsp' },
      { name: 'palm sugar', amount: 1, unit: 'tbsp' },
      { name: 'Thai eggplant', amount: 1, unit: 'cup' },
    ],
    pictureUrl: '/exampleRecipes/ThaiGreenCurry.jpg',
    steps: {
      prep: [
        'Cut chicken into bite-sized pieces',
        'Slice bell peppers and eggplant',
        'Drain bamboo shoots',
      ],
      steps: [
        {
          detail:
            'Heat 1/4 cup coconut milk in pot, add curry paste and fry until fragrant',
        },
        { detail: 'Add chicken pieces and cook until no longer pink' },
        { detail: 'Pour in remaining coconut milk and bring to simmer' },
        { detail: 'Add vegetables and cook for 10 minutes' },
        { detail: 'Season with fish sauce and palm sugar' },
        { detail: 'Stir in Thai basil and serve with jasmine rice' },
      ],
    },
  },
  {
    id: '5',
    name: 'Avocado Toast with Poached Egg',
    description:
      'A healthy and trendy breakfast option featuring creamy avocado on toasted bread topped with a perfectly poached egg.',
    tags: ['breakfast', 'healthy', 'quick', 'vegetarian'],
    source: 'Modern Breakfast Recipe',
    language: 'en',
    totalTime: 15,
    yieldServings: 2,
    equipments: ['toaster', 'small pot', 'fork'],
    cuisine: 'Modern',
    type: 'breakfast',
    ingredients: [
      { name: 'bread slices', amount: 4 },
      { name: 'ripe avocados', amount: 2 },
      { name: 'eggs', amount: 4 },
      { name: 'lemon juice', amount: 1, unit: 'tbsp' },
      { name: 'red pepper flakes', amount: 'to taste' },
      { name: 'salt and pepper', amount: 'to taste' },
      { name: 'white vinegar', amount: 1, unit: 'tbsp' },
    ],
    pictureUrl: '/exampleRecipes/AvacadoEgg.jpg',
    steps: {
      prep: [
        'Toast bread slices until golden',
        'Halve and pit avocados',
        'Bring pot of water to gentle simmer with vinegar',
      ],
      steps: [
        { detail: 'Scoop avocado into bowl and mash with fork' },
        { detail: 'Mix in lemon juice, salt, and pepper' },
        { detail: 'Crack eggs into simmering water and poach for 3-4 minutes' },
        { detail: 'Spread mashed avocado generously on toasted bread' },
        { detail: 'Top each toast with poached egg' },
        {
          detail: 'Sprinkle with red pepper flakes, salt, and pepper to serve',
        },
      ],
    },
  },
  {
    id: '6',
    name: 'Egg Bites with Bacon & Gruyère',
    description:
      'If you like the sous vide egg bites from Starbucks, you’ll love this copycat version—no sous vide equipment required!',
    tags: ['breakfast', 'healthy', 'high-protein'],
    source:
      'https://www.onceuponachef.com/recipes/bacon-gruyere-egg-bites.html',
    language: 'en',
    totalTime: 35,
    yieldServings: 12,
    equipments: ['blender', 'pot', 'muffin pan', 'oven'],
    cuisine: 'Modern',
    type: 'breakfast',
    ingredients: [
      { name: 'bacon slices', amount: 4 },
      { name: 'large eggs', amount: 6 },
      { name: 'cottage cheese(can sub yogurt)', amount: 300, unit: 'g' },
      { name: 'Gruyère cheese', amount: 150, unit: 'g' },
      { name: 'corn starch', amount: 2, unit: 'tbsp' },
      { name: 'salt', amount: '1/4', unit: 'tsp' },
      { name: 'black pepper', amount: '1/8', unit: 'tsp' },
      { name: 'hot saucer(optional)', amount: '1/2', unit: 'tsp' },
    ],
    pictureUrl: '/exampleRecipes/bacon-gruyere-egg-bites.webp',
    steps: {
      prep: [
        'Boil a kettle of water',
        'Preheat oven to 300F',
        'Place a 9x13 inch baking dish on the lower rack and fill it halfway with boiling water',
        'Butter the muffin pan',
        'Cut bacon to small pieces',
      ],
      steps: [
        { detail: 'Cook bacon in skillet until crisp' },
        {
          detail:
            'In a blender, combine eggs, cottage cheese, Gruyère, cornstarch, salt, pepper, and hot sauce',
        },
        { detail: 'Blend to completely smooth, about 30 seconds' },
        {
          detail:
            'Pour the mixture evenly into the prepared muffin pan, filling 3/4 full. Sprinkle bacon over each muffin',
        },
        { detail: 'Bake on middle rack for 20-25mins, until the eggs are set' },
        {
          detail:
            'Remove from oven and let rest in the pan for 5mins, carefully remove from the pan, serve',
        },
      ],
    },
  },
];
