import type { Metadata } from 'next';
import {
  Poppins,
  Space_Grotesk,
  JetBrains_Mono,
  Inter,
} from 'next/font/google';

import './globals.css';
import { cn } from '@/lib/utils';
import { FirebaseProvider } from '@/firebase';
import { NextIntlClientProvider, useMessages } from 'next-intl';

export const metadata: Metadata = {
  title: 'AfgAiHub',
  description: 'A modular AI ecosystem with multiple agents.',
};

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
});

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-body',
  weight: ['400', '500', '600', '700'],
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-headline',
  weight: ['400', '500', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-code',
  weight: ['400', '500', '700'],
});

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const messages = useMessages();

  return (
    <html
      lang={locale}
      className={cn(
        'dark',
        inter.variable,
        poppins.variable,
        spaceGrotesk.variable,
        jetbrainsMono.variable
      )}
    >
      <body className="font-sans antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <FirebaseProvider>{children}</FirebaseProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
