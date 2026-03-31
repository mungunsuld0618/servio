import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Toaster } from 'sonner';
import { Header } from '@/components/header';

const inter = Inter({ subsets: ['latin', 'cyrillic'] });

export const metadata: Metadata = {
  title: 'Servio - Гэртээ мэргэжлийн үйлчилгээ',
  description:
    'Servio нь Монголд хамгийн том үйлчилгээний зах зээл. Гоо сайхан, маникюр, үсчин, цэвэрлэгээ, тогооч, асрагч зэрэг 100+ үйлчилгээг гэртээ захиалаарай.',
  keywords: 'үйлчилгээ, маникюр, үсчин, гоо сайхан, тогооч, асрагч, цэвэрлэгээ',
  authors: [{ name: 'Servio Team' }],
  openGraph: {
    title: 'Servio - Гэртээ мэргэжлийн үйлчилгээ',
    description: 'Мэргэжлийн үйлчилгээг гэртээ, ойрхон, итгэлтэй, хурдан аваарай.',
    url: 'https://servio.mn',
    siteName: 'Servio',
    images: [{ url: 'https://servio.mn/og-image.jpg', width: 1200, height: 630 }],
    locale: 'mn_MN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Servio - Гэртээ мэргэжлийн үйлчилгээ',
    description: 'Мэргэжлийн үйлчилгээг гэртээ, ойрхон, итгэлтэй, хурдан аваарай.',
    images: ['https://servio.mn/twitter-image.jpg'],
  },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
  appleWebApp: { capable: true, statusBarStyle: 'default', title: 'Servio' },
};

export const viewport: Viewport = {
  themeColor: '#7c3aed',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mn">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#7c3aed" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Toaster position="top-center" richColors />
        </Providers>
      </body>
    </html>
  );
}
