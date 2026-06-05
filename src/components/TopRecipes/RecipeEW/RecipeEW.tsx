import { useRouter } from 'next/navigation';
import { Card, CardBody } from '@heroui/card';
import { Image } from '@heroui/image';
import { Recipe } from '@/data/recipe';
import { Tag } from '@/components/Tag';
import { TAGS_LIMIT } from '@/constants';

interface RecipeEWProps {
  recipe: Recipe;
}

export function RecipeEW({ recipe }: RecipeEWProps) {
  const { id, name, pictureUrl, tags } = recipe;
  const router = useRouter();

  return (
    <Card
      isPressable
      fullWidth
      onPress={() => router.push(`/details/${encodeURIComponent(id)}`)}
    >
      <CardBody>
        <div className='flex flex-col gap-6 lg:flex-row'>
          <Image
            isZoomed
            className='h-auto object-cover'
            alt={`${name}-image`}
            src={pictureUrl}
            width={120}
          />
          <div className='flex flex-col justify-between lg:max-w-1/2'>
            <h2 className='text-lg'>{name}</h2>
            <div className='flex flex-row gap-2'>
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
