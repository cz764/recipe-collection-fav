import { Card, CardHeader, CardBody, CardFooter } from '@heroui/card';
import { Image } from '@heroui/image';
import { Recipe } from '@/data/recipe';
import Tag from '@/components/Tag';
import { TAGS_LIMIT } from '@/constants/constants';

interface RecipeEWProps {
  recipe: Recipe;
}

export default function RecipeEW({ recipe }: RecipeEWProps) {
  const { name, pictureUrl, tags } = recipe;
  return (
    <Card isPressable fullWidth>
      <CardBody>
        <div className='flex gap-6'>
          <Image
            className='object-cover'
            alt={`${name}-image`}
            src={pictureUrl}
            height={120}
          />
          <div className='flex max-w-1/2 flex-col justify-between'>
            <h2 className='text-lg'>{name}</h2>
            <div className='flex gap-2'>
              {tags.slice(0, TAGS_LIMIT).map((tag) => (
                <Tag key={`${name}-tag-${tag}`} name={tag} />
              ))}
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
