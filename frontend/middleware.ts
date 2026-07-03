import createMiddleware from 'next-intl/middleware';
import { locales } from './i18n/request';

export default createMiddleware({
  // A list of all locales that are supported
  locales,

  // Used when no locale matches
  defaultLocale: 'en',

  // Only add locale prefix when it's not the default locale
  localePrefix: 'as-needed'
});

export const config = {
  // Match only internationalized pathnames, exclude /IBM routes
  matcher: ['/', '/(en|zh)/:path*', '/((?!_next|_vercel|IBM|.*\\..*).*)']
};

// Made with Bob
