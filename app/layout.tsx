import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Footer } from '@/components/footer';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BioCount.ai - CO₂-based Rapid Microbiological Methods',
  description: 'Convert Soleris Fusion TOU time-series data into cfu/g using the In-Silico Enumeration (ISE) method',
  keywords: 'ISE, microbiology, TOU, CFU, rapid methods, food safety, BioCount',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-gray-50">
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
