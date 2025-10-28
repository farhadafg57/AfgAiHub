import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
  // A list of all locales that are supported
  locales: ['en', 'fa', 'ps'],
  // Used when no locale matches
  defaultLocale: 'en',
  // All public pages that need translations
  localePrefix: 'always',
});

export const config = {
  // Skip all paths that should not be internationalized
  // This includes the dashboard, API routes, and static assets.
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|dashboard).*)'],
};
