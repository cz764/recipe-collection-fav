'use client';

import NextLink from 'next/link';
import { Button } from '@heroui/button';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,
} from '@heroui/dropdown';
import { menuGroups } from '@/components/NavigationBar/menuItems';

interface AllRecipesProps {
  onNavigate?: () => void;
  isMobile?: boolean;
}

export function AllRecipes({ onNavigate, isMobile = false }: AllRecipesProps) {
  return (
    <Dropdown placement='bottom-start' disableAnimation>
      <DropdownTrigger>
        <Button
          variant='light'
          className={
            isMobile
              ? 'h-auto justify-start px-0 text-lg'
              : 'h-auto px-0 text-2xl'
          }
          endContent={<span aria-hidden='true'>⌄</span>}
        >
          All Recipes
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label='Browse recipes'
        onAction={() => onNavigate?.()}
        className='max-h-[70dvh] w-[min(36rem,calc(100vw-2rem))] overflow-y-auto'
        classNames={{
          list: 'grid grid-cols-2 items-start gap-4 sm:grid-cols-3',
        }}
      >
        {menuGroups.map((group) => (
          <DropdownSection
            key={group.title}
            title={group.title}
            aria-label={group.title}
          >
            {group.items.map((item) => (
              <DropdownItem key={item.href} as={NextLink} href={item.href}>
                {item.name}
              </DropdownItem>
            ))}
          </DropdownSection>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
