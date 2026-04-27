'use client';

import { Recipe } from '@/data/recipe';
import { Breadcrumbs, BreadcrumbItem } from '@heroui/breadcrumbs';
import { Image } from '@heroui/image';
import { Divider } from '@heroui/divider';
import { Checkbox } from '@heroui/checkbox';
import { Link } from '@heroui/link';

interface RecipeContentProps {
  recipe: Recipe;
}

const h3ClassName = 'text-xl font-medium';

export function RecipeContent({ recipe }: RecipeContentProps) {
  const {
    name,
    pictureUrl,
    description,
    equipments,
    totalTime,
    yieldServings,
    ingredients,
    steps,
    source,
  } = recipe;
  return (
    <div className='flex flex-col gap-2 p-2'>
      <Breadcrumbs>
        <BreadcrumbItem href='/'>All Recipes</BreadcrumbItem>
        <BreadcrumbItem>{name}</BreadcrumbItem>
      </Breadcrumbs>
      <div className='flex items-center justify-center gap-4'>
        <Image alt={`${name}-picture`} src={pictureUrl} height={300} />
        <h2 className='text-3xl font-semibold'>{name}</h2>
      </div>
      <Divider />
      <span>{description}</span>
      {source && (
        <Link href={source} isExternal showAnchorIcon>
          Recipe Reference
        </Link>
      )}
      <div>
        <h3 className={h3ClassName}>Equipment</h3>
        <Divider />
        <span>{equipments.join(', ')}</span>
      </div>
      <div>
        <h3 className={h3ClassName}>Details</h3>
        <Divider />
        <div className='flex gap-4'>
          <div>Total time: {totalTime} mins</div>
          <div>Yield: {yieldServings} servings</div>
        </div>
      </div>
      <Divider />
      <div className='flex gap-2'>
        <div className='flex flex-col'>
          <h4 className='font-medium'>Ingredients</h4>
          {ingredients.map((ingredient, index) => (
            <Checkbox key={`${ingredient}-${index}-checkbox`}>
              {ingredient.name} {ingredient.amount} {ingredient.unit}
            </Checkbox>
          ))}
        </div>
        <Divider orientation='vertical' />
        <div className='flex flex-col gap-1'>
          <h4 className='font-medium'>Steps</h4>
          <div className='flex flex-col'>
            <h5 className='font-medium'>Prep</h5>
            {steps.prep.map((step, index) => (
              <span key={`prep-${index}`}>{step}</span>
            ))}
          </div>
          <ol className='list-decimal pl-4'>
            {steps.steps.map((step, index) => (
              <li key={`step-detail-${index}`}>
                <div>
                  {step.imageUrl ? (
                    <img alt={`step-${index}`} src={step.imageUrl} />
                  ) : null}
                  <span>{step.detail}</span>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
