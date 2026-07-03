"use client";

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLanguage = () => {
    const newLocale = locale === 'en' ? 'zh' : 'en';
    
    // Remove the current locale from the pathname
    const pathWithoutLocale = pathname.replace(`/${locale}`, '');
    
    // Navigate to the new locale
    router.push(`/${newLocale}${pathWithoutLocale}`);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={switchLanguage}
      aria-label="Switch language"
      title={locale === 'en' ? 'Switch to Chinese' : '切换到英文'}
    >
      <Languages className="h-5 w-5" />
      <span className="ml-1 text-xs font-medium">
        {/* {locale === 'en' ? '中文' : 'EN'} */}
      </span>
    </Button>
  );
}

// Made with Bob
