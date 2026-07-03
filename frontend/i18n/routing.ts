import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['en', 'zh'],

  // Used when no locale matches
  defaultLocale: 'en',

  // Only add locale prefix when it's not the default locale
  localePrefix: 'as-needed'
});

// Lightweight exports for use in client components
export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

// Made with Bob
