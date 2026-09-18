import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { RecipeImage } from '@/components/RecipeImage';
import type { Recipe as RecipeType } from '@/data/recipe';
import { DESCRIPTION_LIMIT, TAGS_LIMIT } from '@/constants';
import { Tag } from '@/components/Tag';
import _ from 'lodash';

interface RecipeCardProps {
  recipeData: RecipeType;
}
export function RecipeCard({ recipeData }: RecipeCardProps) {
  const { id, pictureUrl, name, description, tags } = recipeData;
  const router = useRouter();

  return (
    <Card
      isPressable
      className='w-full'
      onPress={() => router.push(`/details/${encodeURIComponent(id)}`)}
    >
      <CardBody className='flex flex-col justify-between gap-2'>
        <div className='flex flex-col gap-2'>
          <RecipeImage
            sizes='(min-width: 1280px) calc((80vw - 112px) / 3 - 24px), (min-width: 1024px) calc((100vw - 112px) / 3 - 24px), (min-width: 768px) calc((100vw - 72px) / 2 - 24px), (min-width: 640px) calc(100vw - 72px), calc(100vw - 56px)'
            alt={`${name}-image`}
            src={pictureUrl}
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
