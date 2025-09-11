import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ConfigProvider } from '../lib/ConfigContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RaidHelper',
  description: 'RaidHelper Web Application',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ConfigProvider>
          {children}
        </ConfigProvider>
      </body>
    </html>
  );
}
