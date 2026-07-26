import type { Recipe } from './recipe';

export const exampleRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Sourdough',
    description:
      'European style sourdough that does not require a starter. Instead, we develop the flavor by using "Poolish". Perfect slice can be used to make sandwich, or just spread some butter!',
    tags: ['vegetarian', 'european', 'breakfast', 'lunch', 'dough'],
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
      { name: 'yeast', amount: 1, unit: 'tsp' },
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
    creditTo: 'Nigella Lawson(recipe), Rebecca Firth(picture)',
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
    name: 'Japanese Milk Bread',
    description:
      "I had this bread ordered from a bakery in San francisco while I stayed at my friend's house, it blow my mind of how airy and fluffy the milk bread texture can be. After I come back home, I still remembered it. I've tried bake this tangzhong bread myself by following this King Authur blog post, the result is awesome. And plus it saves a lot money since I remember it cost a fortune from the bakery my friend ordered from. The end result is same! The secrete is tangzhong(汤种).",
    tags: ['bread', 'breakfast', 'dough', 'tangzhong', 'japanese', 'oven'],
    source:
      'https://www.kingarthurbaking.com/recipes/japanese-milk-bread-recipe',
    language: 'en',
    totalTime: 180,
    yieldServings: 12,
    equipments: ['large mixing bowl', 'oven', 'sauce pan'],
    cuisine: 'japanese',
    creditTo: 'Charlotte Rutledge',
    type: 'breakfast',
    ingredients: [
      { name: 'For tangzhong: water', amount: 43, unit: 'g' },
      { name: 'milk', amount: 43, unit: 'g' },
      { name: 'bread flour', amount: 14, unit: 'g' },
      { name: 'For Dough: bread flour', amount: 300, unit: 'g' },
      { name: 'granulated sugar', amount: 50, unit: 'g' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'yeast', amount: 1, unit: 'tbsp' },
      { name: 'milk', amount: 113, unit: 'g' },
      { name: 'unsalted butter, melted', amount: 57, unit: 'g' },
      { name: 'egg', amount: 1 },
    ],
    pictureUrl: '/exampleRecipes/japanese-milk-bread.avif',
    steps: {
      prep: [
        'Make tangzhong: combine all tangzhong ingredients in a small saucepan, whisk until no lumps remain.',
        'Place the sauce pan over medium heat, cook and whisk, turn heat to low when seeing the liquid form lines.',
        'Keep cooking a few min until it thickens to a loose paste, leave heat to cool to lukewarm.',
      ],
      steps: [
        {
          detail: 'Mix liquid ingredients together, add sugar and yeast.',
        },
        {
          detail:
            'Add flour and salt, mix to form a dough. Let rest for 15min.',
        },
        { detail: 'Knead until elastic, about 10 min.' },
        {
          detail:
            'Leave the dough to a greased bowl, first proof for 1hr, or cover and put into fridge.',
        },
        {
          detail:
            'When you are ready to work on the dough, bring the dough out, you need to wait 20min for the dough to warm up if left in fridge.',
        },
        {
          detail:
            'Shape the dough: cut to 3 pieces, make them into 3 balls. Grab 1 ball, use rolling pin to roll flat to rectangular shape. Remember to push the rolling pin all the way out. Then fold both of the long ends in, roll it from the top short ends, pinching it down.',
        },
        {
          detail:
            'Repeat to all 3 balls, let rest for 5min. Then repeat this step one more time.',
        },
        {
          detail:
            'Place all shaped 3 balls in a lightly greased loaf pan, cover and let rise for 45min. Until 80-90% of the pan height.',
        },
        { detail: 'Towards the end of rising time, preheat oven to 350F.' },
        { detail: 'Brush the top of loaf with milk, bake the for 30 - 35min.' },
        { detail: 'Remove from oven, let cool in rack. Enjoy!' },
      ],
    },
  },
  {
    id: '5',
    name: 'Wholewheat Loaf Bread',
    description:
      'A healthy and hearty version of sandwich loaf bread, made with 100% whole wheat.',
    tags: ['breakfast', 'healthy', 'vegetarian', 'oven', 'dough'],
    source:
      'https://merryboosters.com/brown-bread-recipe-whole-wheat-bread-recipe/',
    creditTo: 'Bincy Chris',
    language: 'en',
    totalTime: 120,
    yieldServings: 12,
    equipments: ['oven', 'large mixing bowl', 'spatula'],
    cuisine: 'baking',
    type: 'breakfast',
    ingredients: [
      { name: 'whole wheat flour', amount: 357, unit: 'g' },
      { name: 'lukewarm water', amount: 1, unit: 'cup' },
      { name: 'honey', amount: 2, unit: 'tbsp' },
      { name: 'salt', amount: 1, unit: 'tsp' },
      { name: 'unsalted butter room temperature', amount: 3, unit: 'tbsp' },
      { name: 'yeast', amount: '1/ 1/2', unit: 'tsp' },
    ],
    pictureUrl: '/exampleRecipes/whole-wheat-loaf-bread.webp',
    steps: {
      prep: [],
      steps: [
        { detail: 'Combine water, honey, salt, yeast. Whisk together.' },
        {
          detail:
            'Add room temperature butter, then add whole wheat flour. Mix to a shaggy dough.',
        },
        {
          detail:
            'Transfer the dough into a flat surface, knead until elastic, about 10min.',
        },
        {
          detail:
            'Put the dough in a lightly greased bowl, to do first proof until double in size. You can also leave it in fridge overnight if you are not ready to work with the dough.',
        },
        {
          detail:
            'Shape the dough to loaf size. Could follow other instructions from web. Put the dough in loaf pan.',
        },
        {
          detail: 'Let the dough rise for 45min, for second proof.',
        },
        {
          detail:
            'In the end of rising, preheat oven to 350F. Bake the loaf for 32 - 36min.',
        },
        {
          detail:
            'Cover the top with aluminum foil at ~25min mark to prevent over browning.',
        },
        {
          detail: 'Bring the loaf out of oven, let cool on rack. Enjoy!',
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
    creditTo: 'Jennifer Segal',
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
