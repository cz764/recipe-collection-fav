import type { Recipe } from './recipe';

export const exampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Classic Margherita Pizza',
    description:
      'A simple and delicious Italian pizza with fresh tomatoes, mozzarella, and basil. Perfect for a quick dinner with authentic flavors.',
    tags: ['vegetarian', 'italian', 'dinner'],
    source: 'Traditional Italian Recipe',
    language: 'en',
    totalTime: 30,
    yieldServings: 4,
    equipments: ['oven', 'pizza stone', 'rolling pin'],
    cuisine: 'Italian',
    type: 'lunch',
    ingredients: [
      { name: 'pizza dough', amount: 1, unit: 'ball' },
      { name: 'tomato sauce', amount: 1, unit: 'cup' },
      { name: 'fresh mozzarella', amount: 8, unit: 'oz' },
      { name: 'fresh basil', amount: '1 handful' },
      { name: 'olive oil', amount: 2, unit: 'tbsp' },
      { name: 'salt', amount: 'to taste' },
    ],
    pictureUrl: '/exampleRecipes/ClassicMargheritaPizza.webp',
    steps: {
      prep: [
        'Preheat oven to 475°F (245°C)',
        'Roll out pizza dough to 12-inch circle',
        'Tear mozzarella into small pieces',
      ],
      steps: [
        {
          detail:
            'Spread tomato sauce evenly over dough, leaving 1-inch border',
        },
        { detail: 'Distribute mozzarella pieces evenly over sauce' },
        { detail: 'Drizzle with olive oil and season with salt' },
        {
          detail:
            'Bake for 12-15 minutes until crust is golden and cheese is bubbly',
        },
        { detail: 'Top with fresh basil leaves and serve immediately' },
      ],
    },
  },
  {
    id: '2',
    name: '麻婆豆腐',
    description:
      '经典川菜，麻辣鲜香的豆腐料理。嫩滑的豆腐搭配麻辣的肉末酱汁，是一道令人难忘的家常菜。',
    tags: ['spicy', 'sichuan', 'dinner', 'meat'],
    source: '传统川菜',
    language: 'ch',
    totalTime: 25,
    yieldServings: 3,
    equipments: ['wok', 'knife', 'cutting board'],
    cuisine: 'Chinese',
    type: 'dinner',
    ingredients: [
      { name: '嫩豆腐', amount: 400, unit: 'g' },
      { name: '猪肉末', amount: 100, unit: 'g' },
      { name: '豆瓣酱', amount: 2, unit: 'tbsp' },
      { name: '花椒粉', amount: 1, unit: 'tsp' },
      { name: '葱姜蒜', amount: '适量' },
      { name: '酱油', amount: 1, unit: 'tbsp' },
      { name: '淀粉水', amount: 2, unit: 'tbsp' },
    ],
    pictureUrl: '/exampleRecipes/MapoTofu.jpg',
    steps: {
      prep: ['豆腐切小块，用热水焯一下', '葱姜蒜切末备用'],
      steps: [
        { detail: '热锅下油，炒香葱姜蒜' },
        { detail: '加入肉末炒至变色' },
        { detail: '加入豆瓣酱炒出红油' },
        { detail: '加水和豆腐块，小火煮5分钟' },
        { detail: '加酱油调味，用淀粉水勾芡' },
        { detail: '撒上花椒粉和葱花即可' },
      ],
    },
  },
  {
    id: '3',
    name: 'Chocolate Chip Cookies',
    description:
      'Crispy on the outside, chewy on the inside chocolate chip cookies. The perfect American classic dessert that everyone loves.',
    tags: ['dessert', 'baking', 'cookies', 'chocolate'],
    source: 'Family Recipe',
    language: 'en',
    totalTime: 45,
    yieldServings: 24,
    equipments: ['mixing bowl', 'baking sheet', 'electric mixer', 'oven'],
    cuisine: 'American',
    type: 'snack',
    ingredients: [
      { name: 'all-purpose flour', amount: 2.25, unit: 'cups' },
      { name: 'butter', amount: 1, unit: 'cup' },
      { name: 'granulated sugar', amount: 0.75, unit: 'cup' },
      { name: 'brown sugar', amount: 0.75, unit: 'cup' },
      { name: 'eggs', amount: 2 },
      { name: 'vanilla extract', amount: 2, unit: 'tsp' },
      { name: 'baking soda', amount: 1, unit: 'tsp' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'chocolate chips', amount: 2, unit: 'cups' },
    ],
    pictureUrl: '/exampleRecipes/ChocolateChipCookie.jpg',
    steps: {
      prep: [
        'Preheat oven to 375°F (190°C)',
        'Soften butter to room temperature',
        'Line baking sheets with parchment paper',
      ],
      steps: [
        { detail: 'Cream together butter and both sugars until fluffy' },
        { detail: 'Beat in eggs and vanilla extract' },
        { detail: 'Mix flour, baking soda, and salt in separate bowl' },
        { detail: 'Gradually blend dry ingredients into butter mixture' },
        { detail: 'Fold in chocolate chips' },
        {
          detail: 'Drop rounded tablespoons onto baking sheet, 2 inches apart',
        },
        { detail: 'Bake 9-11 minutes until golden brown' },
        {
          detail:
            'Cool on baking sheet for 2 minutes, then transfer to wire rack',
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
];
