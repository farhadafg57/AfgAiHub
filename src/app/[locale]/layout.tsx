import { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider, useMessages } from 'next-intl';
import {
  Poppins,
  Space_Grotesk,
  JetBrains_Mono,
  Inter,
} from 'next/font/google';

import '../globals.css';
import { cn } from '@/lib/utils';
import { FirebaseProvider } from '@/firebase';

type Props = {
  children: ReactNode;
  params: { locale: string };
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

export default function LocaleLayout({ children, params: { locale } }: Props) {
  const messages = useMessages();

  // Validate that the incoming `locale` parameter is valid
  if (['en', 'fa', 'ps'].includes(locale) === false) notFound();

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
