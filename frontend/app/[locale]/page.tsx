"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import FlipCard from "@/components/flip-card";
import { Highlighter } from "@/components/ui/highlighter";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";

export default function Home() {
  const t = useTranslations('home');
  const { theme } = useTheme();
  const [highlightColor, setHighlightColor] = useState("#FFF978");

  useEffect(() => {
    const updateColor = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setHighlightColor(isDark ? "#ED9A47" : "#FFF978");
      } else {
        setHighlightColor(theme === 'dark' ? "#ED9A47" : "#FFF978");
      }
    };

    updateColor();

    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateColor();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight cursor-default">
                <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent animate-gradient-x">
                  Welcome{" "}
                </span>
                <Highlighter
                  action="highlight"
                  color={highlightColor}
                  strokeWidth={1}
                  animationDuration={2000}
                  iterations={3}
                  isView={true}
                >
                  <span className="bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
                    :')
                  </span>
                </Highlighter>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground animate-fade-in-up animation-delay-200">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap gap-6 animate-fade-in-up animation-delay-400">
              <Button asChild size="lg" className="group relative overflow-hidden hover:scale-110 transition-all duration-300 hover:shadow-2xl hover:shadow-foreground/20 px-8 py-6 text-lg">
                <Link href="/about">
                  <span className="relative z-10">{t('aboutMe')}</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-foreground/90 to-foreground/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover:scale-110 transition-all duration-300 hover:border-foreground/50 hover:shadow-lg hover:shadow-foreground/10 hover:bg-foreground/5 px-8 py-6 text-lg">
                <Link href="/portfolio">{t('viewPortfolio')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="hover:scale-110 transition-all duration-300 hover:border-foreground/40 hover:shadow-lg hover:shadow-foreground/10 hover:bg-foreground/5 px-8 py-6 text-lg">
                <Link href="/cv">{t('downloadCV')}</Link>
              </Button>
            </div>
          </div>

          {/* Right side - 3D Flip Card */}
          <div className="relative flex w-full justify-center lg:justify-start lg:ml-30 animate-fade-in-up animation-delay-600">
            <FlipCard
              frontImage="/Profile_Photo.jpg"
              logoLight="/fermi-logo-text2.png"
              logoDark="/fermi-logo-text2.png"
              alt="Profile Photo"
              className="w-full max-w-[450px]"
            />
          </div>
        </div>

        {/* Contact Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
          {/* Email Card */}
          <a
            href="mailto:siqi.fei@mail.utoronto.ca"
            className="group p-6 rounded-lg border border-border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-foreground/30 relative overflow-hidden animate-fade-in-up animation-delay-800"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h3 className="text-xl font-semibold group-hover:text-foreground transition-colors duration-300">{t('contactCards.email.title')}</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 text-sm break-all">
                {t('contactCards.email.value')}
              </p>
            </div>
          </a>

          {/* Phone Card */}
          <a
            href="tel:+16478662089"
            className="group p-6 rounded-lg border border-border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-foreground/30 relative overflow-hidden animate-fade-in-up animation-delay-900"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <h3 className="text-xl font-semibold group-hover:text-foreground transition-colors duration-300">{t('contactCards.phone.title')}</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 text-sm">
                {t('contactCards.phone.value')}
              </p>
            </div>
          </a>

          {/* LinkedIn Card */}
          <a
            href="https://www.linkedin.com/in/siqi-fermi-fei"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-lg border border-border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-foreground/30 relative overflow-hidden animate-fade-in-up animation-delay-1000"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                <h3 className="text-xl font-semibold group-hover:text-foreground transition-colors duration-300">{t('contactCards.linkedin.title')}</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 text-sm">
                {t('contactCards.linkedin.value')}
              </p>
            </div>
          </a>

          {/* GitHub Card */}
          <a
            href="https://github.com/FXXFERMI"
            target="_blank"
            rel="noopener noreferrer"
            className="group p-6 rounded-lg border border-border bg-card hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:border-foreground/30 relative overflow-hidden animate-fade-in-up animation-delay-1100"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-2">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                <h3 className="text-xl font-semibold group-hover:text-foreground transition-colors duration-300">{t('contactCards.github.title')}</h3>
              </div>
              <p className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300 text-sm">
                {t('contactCards.github.value')}
              </p>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
