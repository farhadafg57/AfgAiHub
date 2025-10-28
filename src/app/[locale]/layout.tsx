import { ReactNode } from 'react';
import {notFound} from 'next/navigation';

type Props = {
  children: ReactNode;
  params: {locale: string};
};

// Even though this component is just passing its children through, the presence
// of this file fixes an issue in Next.js 13.4 where link clicks that switch
// the locale would otherwise cause a full reload.
export default function LocaleLayout({children, params: {locale}}: Props) {
  // Validate that the incoming `locale` parameter is valid
  if (['en', 'fa', 'ps'].includes(locale) === false) notFound();

  return children;
}
