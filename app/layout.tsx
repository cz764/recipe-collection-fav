import './globals.css';
import { Providers } from './providers';
import NavigationBar from './components/NavigationBar';
import Footer from './components/Footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body>
        <Providers>
          <NavigationBar />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
