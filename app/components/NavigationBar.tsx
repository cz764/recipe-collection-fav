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
      <NavbarContent className='hidden gap-4 sm:flex' justify='center'>
        <NavbarItem>
          <Link color='foreground' href='#'>
            About
          </Link>
        </NavbarItem>
        <NavbarItem isActive>
          <Link aria-current='page' href='#'>
            All Recipes
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            Chinese
          </Link>
        </NavbarItem>
        <NavbarItem>
          <Link color='foreground' href='#'>
            Bake
          </Link>
        </NavbarItem>
      </NavbarContent>
      <NavbarContent justify='end'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        />
      </NavbarContent>
      <NavbarMenu>
        {menuItems.map((item) => (
          <NavbarMenuItem key={`${item}`}>
            <Link className='w-full' size='lg'>
              {item}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
