"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { useTranslations } from 'next-intl';
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import Image from "next/image";

const navItems = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  // { href: "/club", key: "club" }, // Hidden for now
  { href: "/cv", key: "cv" },
  { href: "/portfolio", key: "portfolio" },
];

export function Navigation() {
  const pathname = usePathname();
  const t = useTranslations('navigation');
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/fermi-logo-light.png");

  useEffect(() => {
    const updateLogo = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setLogoSrc(isDark ? "/fermi-logo-dark.png" : "/fermi-logo-light.png");
      } else {
        setLogoSrc(theme === 'dark' ? "/fermi-logo-dark.png" : "/fermi-logo-light.png");
      }
    };

    updateLogo();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateLogo();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 animate-slide-down">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center gap-12">
            <Link
              href="/"
              className="group relative flex items-center gap-3 text-2xl font-bold tracking-tight hover:scale-105 transition-all duration-300"
            >
              <Image
                src={logoSrc}
                alt="Fermi Logo"
                width={40}
                height={40}
                className="transition-transform duration-300 group-hover:rotate-12"
              />
              <span className="relative z-10 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
                Siqi (Fermi) Fei
              </span>
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-foreground group-hover:w-full transition-all duration-500 ease-out"></span>
            </Link>
            <div className="hidden md:flex items-center gap-1">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href || pathname.endsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "relative px-4 py-2 text-base font-medium transition-all duration-300 rounded-lg group overflow-hidden",
                      "hover:scale-110 hover:shadow-lg",
                      isActive
                        ? "text-foreground bg-foreground/5"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <span className="relative z-10">{t(item.key)}</span>
                    <span className={cn(
                      "absolute inset-0 bg-foreground/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left",
                      isActive && "scale-x-100"
                    )}></span>
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-foreground group-hover:w-3/4 transition-all duration-300"></span>
                  </Link>
                );
              })}
            </div>
          </div>
          <div className="flex items-center gap-3 animate-fade-in animation-delay-600">
            <div className="hover:scale-110 transition-transform duration-300">
              <LanguageSwitcher />
            </div>
            <div className="hover:scale-110 transition-transform duration-300">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

// Made with Bob
