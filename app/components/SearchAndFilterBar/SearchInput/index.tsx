import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import SearchIcon from '@/components/Icons/SearchIcon';

interface SearchInputProps {
  searchText: string;
  onSearchTextChange: React.Dispatch<React.SetStateAction<string>>;
  onSearch: () => void;
}

export default function SearchInput({
  searchText,
  onSearchTextChange,
  onSearch,
}: SearchInputProps) {
  return (
    <Input
      isClearable
      className='max-w-sm'
      aria-label='Search Input'
      size='sm'
      maxLength={100}
      value={searchText}
      onValueChange={onSearchTextChange}
      startContent={
        <Button
          isIconOnly
          aria-label='Search'
          variant={'light'}
          onPress={onSearch}
        >
          <SearchIcon className='pointer-events-none size-6' />
        </Button>
      }
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          onSearch();
        }
      }}
    />
  );
}
