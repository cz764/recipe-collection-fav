'use client';

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

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = [
    { name: 'About', link: '/about' },
    { name: 'All Recipes', link: '/' },
    { name: 'Chinese', link: '/?cuisine=chinese' },
    { name: 'Desert', link: '/?type=desert' },
    { name: 'Breakfast', link: '/?type=breakfast' },
  ];

  return (
    <Navbar
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
      <NavbarContent className='hidden gap-16 sm:flex' justify='center'>
        {menuItems.map(({ name, link }) => (
          <NavbarItem key={`${name}-nav`}>
            <Link className='text-2xl' color='foreground' href={link} size='lg'>
              {name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map(({ name, link }) => (
          <NavbarMenuItem key={`${name}-menu`}>
            <Link className='w-full' size='lg' href={link}>
              {name}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
