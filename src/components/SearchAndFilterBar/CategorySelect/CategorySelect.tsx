import { Select, SelectItem } from '@heroui/select';
import { parseCategorySelection } from '@/utils';

export const categories = [
  { key: 'chinese', label: 'Chinese' },
  { key: 'dessert', label: 'Dessert' },
  { key: 'vegetarian', label: 'Vegetarian' },
  { key: 'italian', label: 'Italian' },
  { key: 'one-pot', label: 'One Pot' },
  { key: 'noodle', label: 'Noodle' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'healthy', label: 'Healthy' },
];

export const CATEGORY_LIMIT = 3;
const DELIMITER = ',';

interface CategorySelectProps {
  onCategoryChange: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export function CategorySelect({ onCategoryChange }: CategorySelectProps) {
  const handleSelectionChange = (e) => {
    const result = parseCategorySelection(
      e.target.value,
      CATEGORY_LIMIT,
      DELIMITER,
    );
    if (result !== null) {
      onCategoryChange(result);
    }
  };

  return (
    <Select
      className='max-w-xs'
      aria-label='Category'
      placeholder='Select up to 3 categories'
      selectionMode='multiple'
      onChange={handleSelectionChange}
    >
      {categories.map(({ key, label }) => (
        <SelectItem key={key}>{label}</SelectItem>
      ))}
    </Select>
  );
}
