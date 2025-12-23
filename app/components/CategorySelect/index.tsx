'use client';

import { Select, SelectSection, SelectItem } from '@heroui/select';

// Todo: state management: search for Recipe.name, tags, and cuisine
export const categories = [
  { key: 'chinese', label: 'Chinese' },
  { key: 'bake', label: 'Bake' },
  { key: 'vegeterian', label: 'Vegeterian' },
  { key: 'italian', label: 'Italian' },
  { key: 'onePot', label: 'One Pot' },
  { key: 'noodle', label: 'Noodle' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'healthy', label: 'Healthy' },
];

export default function CategorySelect() {
  return (
    <Select
      className='max-w-xs'
      aria-label='Category'
      placeholder='Select a category'
    >
      {categories.map((category) => (
        <SelectItem key={category.key}>{category.label}</SelectItem>
      ))}
    </Select>
  );
}
