import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import type { Recipe as RecipeType } from '@/data/recipe';
import { DESCRIPTION_LIMIT, TAGS_LIMIT } from '@/constants/constants';
import Tag from '@/components/Tag';
import _ from 'lodash';

interface RecipeCardProps {
  recipeData: RecipeType;
}
export default function RecipeCard({ recipeData }: RecipeCardProps) {
  const { pictureUrl, name, description, ingredients, tags } = recipeData;
  return (
    <Card isPressable className='w-full'>
      <CardBody className='flex flex-col justify-between gap-2'>
        <div className='flex flex-col gap-2'>
          <Image
            isZoomed
            className='object-cover'
            alt={`${name}-image`}
            src={pictureUrl}
            height={300}
            width={300}
          />
          <div className='flex flex-col'>
            <h2 className='text-lg'>{name}</h2>
            <p>
              {_.truncate(description, {
                length: DESCRIPTION_LIMIT,
              })}
            </p>
          </div>
        </div>
        <div className='flex gap-2'>
          {tags.slice(0, TAGS_LIMIT).map((tag) => (
            <Tag key={`${name}-tag-${tag}`} name={tag} />
          ))}
        </div>
      </CardBody>
    </Card>
  );
}
