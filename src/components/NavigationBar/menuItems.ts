export interface MenuItem {
  name: string;
  link: string;
}

export const defaultMenuItems: MenuItem[] = [
  { name: 'About', link: '/about' },
  { name: 'All Recipes', link: '/' },
  { name: 'Chinese', link: '/?cuisine=chinese' },
  { name: 'Dessert', link: '/?meal=dessert' },
  { name: 'Breakfast', link: '/?meal=breakfast' },
];
