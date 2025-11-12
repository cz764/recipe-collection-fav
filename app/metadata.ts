import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    default: 'C.Z. Recipe Collection',
    template: '%s | C.Z. Recipe Collection',
  },
  description:
    'Discover, save, and share your favorite recipes. From quick weeknight dinners to special occasion desserts, find culinary inspiration for every meal.',
  keywords: [
    'recipes',
    'cooking',
    'food',
    'meal planning',
    'dinner ideas',
    'desserts',
    'breakfast',
    'lunch',
  ],
  authors: [{ name: 'C.Z.' }],
  creator: 'C.Z.',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'C.Z. Recipe Collection',
    description: 'Discover, save, and share your favorite recipes',
    siteName: 'C.Z. Recipe Collection',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'C.Z. Recipe Collection',
    description: 'Discover, save, and share your favorite recipes',
  },
  icons: {
    icon: '/favicon.ico',
  },
};
