import { Roboto } from 'next/font/google';
import './globals.css';

const roboto = Roboto({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-roboto',
});

const sansSerif = 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${roboto.variable}`}>
      <body style={{ fontFamily: `var(--font-roboto), ${sansSerif}` }}>
        {children}
      </body>
    </html>
  );
}