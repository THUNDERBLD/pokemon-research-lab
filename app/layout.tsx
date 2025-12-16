import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Pokemon Research Lab',
  description: 'High-performance Pokemon data analysis and management tool',
  keywords: ['pokemon', 'pokedex', 'data analysis', 'research'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="bg-gray-50 antialiased">
        {children}
      </body>
    </html>
  );
}