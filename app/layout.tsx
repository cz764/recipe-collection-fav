import './globals.css';
import { Inria_Sans } from 'next/font/google';
import { Providers } from './providers';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';

const inriaSans = Inria_Sans({
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inria-sans',
});

export { metadata } from './metadata';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en' className={inriaSans.variable}>
      <body>
        <Providers>
          <NavigationBar />
          <main className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
