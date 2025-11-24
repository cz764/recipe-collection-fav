import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';

import type { Recipe } from '@/data/recipe';

interface TodayRecipeProps {
  recipe: Recipe;
}

export default function TodayRecipe({ recipe }: TodayRecipeProps) {
  const { name, pictureUrl, description, ingredients, tags } = recipe;
  return (
    <Card className='w-full md:max-w-3/5' fullWidth>
      <CardBody>
        <div className='flex gap-6'>
          <div>
            <Image
              isZoomed
              className='object-cover'
              alt={name}
              src={pictureUrl}
              height={300}
              width={300}
            />
          </div>
          <div className='flex-1 flex-col justify-between'>
            <div>
              <h1>Today's recipe</h1>
              <h2>{name}</h2>
              <p>{description}</p>
              <p>Ingredients:</p>
              <p>
                {ingredients
                  .map(({ name }) => name)
                  .slice(0, 4)
                  .join(', ')}
              </p>
            </div>
            <div>{tags.join(', ')}</div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
