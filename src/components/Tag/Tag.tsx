import { Chip } from '@heroui/chip';

interface TagProps {
  name: string;
}

export function Tag({ name }: TagProps) {
  return (
    <Chip color='secondary' data-testid='recipe-tags'>
      {name}
    </Chip>
  );
}
