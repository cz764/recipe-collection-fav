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

export default function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const menuItems = ['About', 'All Recipes', 'Chinese', 'Bake'];

  return (
    <Navbar
      isBordered
      onMenuOpenChange={setIsMenuOpen}
      className='bg-amber-500'
    >
      <NavbarBrand>
        <img
          src='/logo.png'
          alt='logo'
          className='h-14 w-14 rounded-full object-contain'
        />
      </NavbarBrand>
      <NavbarContent className='flex gap-16' justify='center'>
        {menuItems.map((item) => (
          <NavbarItem key={`${item}-nav`}>
            <Link className='text-2xl' color='foreground' href='#' size='lg'>
              {item}
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
        {menuItems.map((item) => (
          <NavbarMenuItem key={`${item}-menu`}>
            <Link className='w-full' size='lg'>
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
