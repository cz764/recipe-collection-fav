import { CUISINES, MEAL_TYPES } from '@/constants/recipe';
import { titleCase } from '@/utils/labels';
export interface MenuItem {
  name: string;
  link: string;
  kind?: 'all-recipes';
}

export const defaultMenuItems: MenuItem[] = [
  // TODO: Restore About after writing the story and creating its page.
  // { name: 'About', link: '/about' },
  { name: 'All Recipes', link: '/', kind: 'all-recipes' },
  { name: 'Bakery', link: '/?type=bakery' },
];

export const formatLink = (key: string, value: string) =>
  `/?${new URLSearchParams({ [key]: value })}`;

export const menuGroups = [
  { title: 'Browse', items: [{ name: 'View all recipes', href: '/' }] },
  {
    title: 'Meal',
    items: MEAL_TYPES.map((meal) => ({
      name: titleCase(meal),
      href: formatLink('meal', meal),
    })),
  },
  {
    title: 'Cuisine',
    items: CUISINES.filter((cuisine) => cuisine !== 'unknown').map(
      (cuisine) => ({
        name: titleCase(cuisine),
        href: formatLink('cuisine', cuisine),
      }),
    ),
  },
  {
    title: 'Dietary',
    items: [{ name: 'Vegetarian', href: formatLink('tag', 'vegetarian') }],
  },
  {
    title: 'Preparation',
    items: [{ name: 'One pot', href: formatLink('tag', 'one-pot') }],
  },
];
