import type { Metadata } from 'next';
import { Caveat, IBM_Plex_Mono, Inter, Montserrat } from 'next/font/google';
import './globals.css';

const display = Montserrat({ subsets: ['latin'], weight: ['500', '600', '700', '800'], variable: '--font-display' });
const body = Inter({ subsets: ['latin'], weight: ['300', '400', '500', '600'], variable: '--font-body' });
const mono = IBM_Plex_Mono({ subsets: ['latin'], weight: ['400', '500'], variable: '--font-mono' });
const script = Caveat({ subsets: ['latin'], weight: ['400', '600'], variable: '--font-script' });

export const metadata: Metadata = {
  title: 'E-Africa Services | Hire Exceptional African Talent',
  description:
    'Hire fully vetted African remote professionals across Customer Success, Sales, IT, Operations, Finance and more. We recruit, vet, onboard, and manage exceptional talent so you can scale with confidence.',
  icons: { icon: '/brand/eafrica-logo.png' },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable} ${script.variable}`}>
      <body>
        <a className="skip" href="#main">Skip to content</a>
        {children}
      </body>
    </html>
  );
}
