import { notFound } from 'next/navigation';
import { getRequestConfig } from 'next-intl/server';

const locales = ['en', 'fa', 'ps'];

export default getRequestConfig(async ({ locale }) => {
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (
      await (locale === 'en'
        ? // When using Turbopack, this will be tree-shaken
          import('./src/messages/en.json')
        : import(`./src/messages/${locale}.json`))
    ).default,
  };
});
