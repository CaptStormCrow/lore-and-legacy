import type { Metadata } from 'next';
import { Cinzel, Crimson_Pro } from 'next/font/google';
import './globals.css';

const cinzel = Cinzel({
  subsets: ['latin'],
  variable: '--font-cinzel',
  display: 'swap',
});

const crimsonPro = Crimson_Pro({
  subsets: ['latin'],
  variable: '--font-crimson',
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lore & Legacy — Weekly World Packets for TTRPG Storytellers',
  description: 'Every week, a fully cohesive fictional world delivered to your inbox. Regions, factions, mystery hooks, NPCs, and artifacts — ready for your table.',
  openGraph: {
    title: 'Lore & Legacy',
    description: 'Weekly world packets for TTRPG storytellers.',
    siteName: 'Lore & Legacy',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cinzel.variable} ${crimsonPro.variable}`}>
      <body>{children}</body>
    </html>
  );
}
