import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'sign.vzbygg.no',
  description: 'Skriv og send inn — lagres sikkert for eier.',
  robots: { index: true, follow: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body>
        <main>{children}</main>
      </body>
    </html>
  );
}
