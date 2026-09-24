import { CUISINES, MEAL_TYPES } from '@/constants/recipe';
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

const parseLabel = (value: string) =>
  value
    .split('-')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ');

export const formatLink = (key: string, value: string) =>
  `/?${new URLSearchParams({ [key]: value })}`;

export const menuGroups = [
  { title: 'Browse', items: [{ name: 'View all recipes', href: '/' }] },
  {
    title: 'Meal',
    items: MEAL_TYPES.map((meal) => ({
      name: parseLabel(meal),
      href: formatLink('meal', meal),
    })),
  },
  {
    title: 'Cuisine',
    items: CUISINES.filter((cuisine) => cuisine !== 'unknown').map(
      (cuisine) => ({
        name: parseLabel(cuisine),
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
