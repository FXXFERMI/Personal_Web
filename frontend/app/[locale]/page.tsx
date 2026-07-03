"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import InteractiveParticlePortrait, { InteractiveParticlePortraitRef } from "@/components/interactive-particle-portrait";
import { useRef } from "react";
import { PortraitProvider } from "@/components/portrait-context";

export default function Home() {
  const t = useTranslations('home');
  const portraitRef = useRef<InteractiveParticlePortraitRef>(null);

  return (
    <PortraitProvider portraitRef={portraitRef}>
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4 py-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left side - Text content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight">
                {t('title')}
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground">
                {t('subtitle')}
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/about">{t('aboutMe')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/portfolio">{t('viewPortfolio')}</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/cv">{t('downloadCV')}</Link>
              </Button>
            </div>
          </div>

          {/* Right side - Interactive Particle Portrait */}
          <div className="relative flex w-full justify-center lg:justify-end">
            <InteractiveParticlePortrait
              ref={portraitRef}
              imageSrc="/Profile_Photo.jpg"
              logoSrcLight="/fermi-logo-light.png"
              logoSrcDark="/fermi-logo-dark.png"
              alt="Profile Photo"
              fragmentGap={5}
              fragmentSizeVariation={0.6}
              windDistance={340}
              turbulenceStrength={16}
              interactionTravelDistance={0.4}
              pixelateFrontWidth={0.08}
              dissolveTrailWidth={0.28}
              frontSoftness={0.03}
              className="w-full max-w-[680px]"
            />
          </div>
        </div>

        {/* Bottom cards section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{t('aboutCard.title')}</h3>
            <p className="text-muted-foreground">
              {t('aboutCard.description')}
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{t('portfolioCard.title')}</h3>
            <p className="text-muted-foreground">
              {t('portfolioCard.description')}
            </p>
          </div>
          <div className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow">
            <h3 className="text-xl font-semibold mb-2">{t('clubCard.title')}</h3>
            <p className="text-muted-foreground">
              {t('clubCard.description')}
            </p>
          </div>
        </div>
      </div>
      </div>
    </PortraitProvider>
  );
}

// Made with Bob
