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
        <div className='flex gap-6'>
          <Image
            className='object-cover'
            alt={`${name}-image`}
            src={pictureUrl}
            height={120}
            width={120}
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
