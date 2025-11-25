import { Chip } from '@heroui/chip';

interface TagProps {
  name: string;
}

export default function Tag({ name }: TagProps) {
  return <Chip color='secondary'>{name}</Chip>;
}
