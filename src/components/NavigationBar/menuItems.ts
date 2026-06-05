export interface MenuItem {
  name: string;
  link: string;
}

export const defaultMenuItems: MenuItem[] = [
  { name: 'About', link: '/about' },
  { name: 'All Recipes', link: '/' },
  { name: 'Chinese', link: '/?cuisine=chinese' },
  { name: 'Dessert', link: '/?type=dessert' },
  { name: 'Breakfast', link: '/?type=breakfast' },
];
