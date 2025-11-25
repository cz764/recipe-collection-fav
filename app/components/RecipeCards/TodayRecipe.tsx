import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import type { Recipe } from '@/data/recipe';
import { DESCRIPTION_LIMIT, INGREDIENTS_LIMIT } from '@/constants/constants';
import Tag from '../Tag/Tag';

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
          <div className='flex flex-1 flex-col justify-between'>
            <div>
              <h1 className='text-2xl'>Today's recipe</h1>
              <h2 className='text-xl'>{name}</h2>
              <p>{description.slice(0, DESCRIPTION_LIMIT)}</p>
              <p>Ingredients:</p>
              <p>
                {ingredients
                  .map(({ name }) => name)
                  .slice(0, INGREDIENTS_LIMIT)
                  .join(', ')}
              </p>
            </div>
            <div className='flex gap-2'>
              {tags.map((tag) => (
                <Tag key={`${name}-tag-${tag}`} name={tag} />
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
