import type { Metadata } from "next";
import "../globals.css";
import { Navigation } from "@/components/navigation";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';

export const metadata: Metadata = {
  title: "Siqi (Fermi) Fei - Personal Website",
  description: "Personal website showcasing my work, experience, and interests",
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  // Ensure that the incoming `locale` is valid
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <>
      <ThemeScript />
      <NextIntlClientProvider messages={messages}>
        <ThemeProvider
          defaultTheme="system"
          storageKey="siqi-fei-theme"
        >
          <div className={`min-h-full flex flex-col ${locale === 'en' ? 'font-serif' : ''}`}>
            <Navigation />
            <main className="flex-1 pt-16">{children}</main>
          </div>
        </ThemeProvider>
      </NextIntlClientProvider>
    </>
  );
}

// Made with Bob
