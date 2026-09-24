'use client';

import NextLink from 'next/link';
import { AllRecipes } from './AllRecipes';
import { useState } from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
} from '@heroui/navbar';
import { Link } from '@heroui/link';
import { defaultMenuItems, type MenuItem } from './menuItems';

interface NavigationBarProps {
  menuItems?: MenuItem[];
}

export function NavigationBar({
  menuItems = defaultMenuItems,
}: NavigationBarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      isMenuOpen={isMenuOpen}
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      className='bg-nav-background'
    >
      <NavbarBrand>
        <Link href='/'>
          <img
            src='/logo.png'
            alt='logo'
            className='h-14 w-14 rounded-full object-contain'
          />
        </Link>
      </NavbarBrand>
      <NavbarContent
        className='hidden gap-6 lg:flex xl:gap-10'
        justify='center'
      >
        {menuItems.map(({ name, link, kind }) => (
          <NavbarItem key={`${name}-nav`}>
            {kind === 'all-recipes' ? (
              <AllRecipes />
            ) : (
              <Link
                as={NextLink}
                className='text-2xl'
                color='foreground'
                href={link}
                size='lg'
              >
                {name}
              </Link>
            )}
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent className='lg:hidden' justify='end'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarMenu className='lg:hidden'>
        {menuItems.map(({ name, link, kind }) => (
          <NavbarMenuItem key={`${name}-menu`}>
            {kind === 'all-recipes' ? (
              <AllRecipes isMobile onNavigate={() => setIsMenuOpen(false)} />
            ) : (
              <Link
                as={NextLink}
                className='w-full'
                size='lg'
                href={link}
                onPress={() => setIsMenuOpen(false)}
              >
                {name}
              </Link>
            )}
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
