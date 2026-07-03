import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames, exclude /IBM routes
  matcher: ['/', '/(en|zh)/:path*', '/((?!_next|_vercel|IBM|.*\\..*).*)']
};

// Made with Bob
