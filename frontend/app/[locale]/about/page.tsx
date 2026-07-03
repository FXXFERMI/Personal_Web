'use client';

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

function ImageGallery({ images, alt }: ImageGalleryProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-6">
      {images.map((src, index) => (
        <div
          key={src}
          className="relative aspect-square rounded-lg overflow-hidden group cursor-pointer"
          onMouseEnter={() => setHoveredIndex(index)}
          onMouseLeave={() => setHoveredIndex(null)}
          style={{
            animation: `fadeInUp 0.6s ease-out ${index * 0.1}s both`
          }}
        >
          <Image
            src={src}
            alt={`${alt} ${index + 1}`}
            fill
            className={`object-cover transition-all duration-500 ${
              hoveredIndex === index
                ? 'scale-110 brightness-110'
                : hoveredIndex !== null
                ? 'scale-95 brightness-75'
                : 'scale-100'
            }`}
            sizes="(max-width: 768px) 50vw, 33vw"
          />
          <div className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${
            hoveredIndex === index ? 'opacity-100' : 'opacity-0'
          }`} />
        </div>
      ))}
    </div>
  );
}

export default function About() {
  const t = useTranslations('about');
  const [currentSection, setCurrentSection] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll('.full-page-section');
      const scrollPosition = window.scrollY + window.innerHeight / 2;

      sections.forEach((section, index) => {
        const sectionTop = (section as HTMLElement).offsetTop;
        const sectionBottom = sectionTop + (section as HTMLElement).offsetHeight;

        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
          setCurrentSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const teachingImages = [
    '/teaching/lec.jpg',
    '/teaching/tut1.jpg',
    '/teaching/tut2.jpg',
  ];

  const catImages = [
    '/cat_20/20_1.jpg',
    '/cat_20/20_2.png',
    '/cat_20/20_3.jpg',
    '/cat_20/me_20.jpg',
    '/cat_20/me_20_2.jpg',
    '/cat_20/me_20_3.jpg',
  ];

  const dailyImages = [
    '/daily/school.jpg',
    '/daily/office.jpg',
    '/daily/workspace.jpg',
    '/daily/workspace2.jpg',
  ];

  const scrollToSection = (index: number) => {
    const sections = document.querySelectorAll('.full-page-section');
    sections[index]?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style jsx global>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .section-card {
          transition: all 0.3s ease;
        }

        .section-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        .scroll-indicator {
          animation: bounce 2s ease-in-out infinite;
        }

        .full-page-section {
          scroll-snap-align: start;
        }

        html {
          scroll-behavior: smooth;
        }
      `}</style>

      {/* Navigation Dots */}
      <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
        {[0, 1, 2, 3, 4].map((index) => (
          <button
            key={index}
            onClick={() => scrollToSection(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              currentSection === index 
                ? 'bg-primary scale-125' 
                : 'bg-muted-foreground/30 hover:bg-muted-foreground/60'
            }`}
            aria-label={`Go to section ${index + 1}`}
          />
        ))}
      </div>

      <div className="snap-y snap-mandatory overflow-y-scroll h-screen">
        {/* Section 1: Hero/Intro */}
        <section className="full-page-section min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
          {/* Background Logo - Light Mode (shows light logo) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 dark:hidden">
            <Image
              src="/fermi-logo-light.png"
              alt="Fermi Logo Background"
              width={700}
              height={700}
              className="object-contain animate-float opacity-[0.05] blur-[1px]"
              priority
            />
          </div>
          
          {/* Background Logo - Dark Mode (shows dark logo) */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 hidden dark:flex">
            <Image
              src="/fermi-logo-dark.png"
              alt="Fermi Logo Background"
              width={700}
              height={700}
              className="object-contain animate-float opacity-[0.15] blur-[1px]"
              priority
            />
          </div>
          
          <div className="container max-w-4xl relative z-10">
            <div className="space-y-6 text-center" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                {t('title')}
              </h1>
              <p className="text-3xl md:text-4xl font-medium text-muted-foreground" style={{ animation: 'slideInLeft 0.8s ease-out' }}>
                {t('subtitle')}
              </p>
              <div className="text-lg md:text-xl text-muted-foreground leading-relaxed space-y-4 max-w-3xl mx-auto" style={{ animation: 'fadeInUp 1s ease-out' }}>
                {t('intro').split('\n\n').map((paragraph, index) => (
                  <p key={index} className="hover:text-foreground transition-colors duration-300">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 scroll-indicator">
            <div className="w-6 h-10 border-2 border-muted-foreground/50 rounded-full flex items-start justify-center p-2">
              <div className="w-1.5 h-3 bg-muted-foreground/50 rounded-full" />
            </div>
          </div>
        </section>

        {/* Section 2: About Me with Daily Life Images */}
        <section className="full-page-section min-h-screen flex items-center justify-center px-4 py-12">
          <div className="container max-w-5xl">
            <div className="section-card p-6 md:p-10 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-semibold mb-8 flex items-center gap-4">
                <span className="animate-float text-5xl">🌟</span>
                {t('aboutMeTitle')}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4 mb-8">
                {t('aboutMeContent').split('\n\n').map((paragraph, index) => (
                  <p key={index} className="hover:text-foreground transition-colors duration-300">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ImageGallery images={dailyImages} alt="Daily life" />
            </div>
          </div>
        </section>

        {/* Section 3: Work in Tech with Teaching Images */}
        <section className="full-page-section min-h-screen flex items-center justify-center px-4 py-12">
          <div className="container max-w-5xl">
            <div className="section-card p-6 md:p-10 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-semibold mb-8 flex items-center gap-4">
                <span className="animate-float text-5xl" style={{ animationDelay: '0.5s' }}>💻</span>
                {t('workTitle')}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4 mb-8">
                {t('workContent').split('\n\n').map((paragraph, index) => (
                  <p key={index} className="hover:text-foreground transition-colors duration-300">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ImageGallery images={teachingImages} alt="Teaching and work" />
            </div>
          </div>
        </section>

        {/* Section 4: Non-Tech with Cat Images */}
        <section className="full-page-section min-h-screen flex items-center justify-center px-4 py-12">
          <div className="container max-w-5xl">
            <div className="section-card p-6 md:p-10 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
              <h2 className="text-4xl md:text-5xl font-semibold mb-8 flex items-center gap-4">
                <span className="animate-float text-5xl" style={{ animationDelay: '1s' }}>🐾</span>
                {t('nonTechTitle')}
              </h2>
              <div className="text-lg text-muted-foreground leading-relaxed space-y-4 mb-8">
                {t('nonTechContent').split('\n\n').map((paragraph, index) => (
                  <p key={index} className="hover:text-foreground transition-colors duration-300">
                    {paragraph}
                  </p>
                ))}
              </div>
              <ImageGallery images={catImages} alt="My cat Twenty" />
            </div>
          </div>
        </section>

        {/* Section 5: CTA */}
        <section className="full-page-section min-h-screen flex items-center justify-center px-4 py-12">
          <div className="container max-w-4xl text-center">
            <div className="space-y-8" style={{ animation: 'fadeInUp 0.6s ease-out' }}>
              <h2 className="text-4xl md:text-5xl font-bold">Let's Connect</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Interested in learning more about my work or want to collaborate? Check out my CV and portfolio.
              </p>
              <div className="flex gap-4 flex-wrap justify-center pt-4">
                <Button 
                  asChild 
                  size="lg"
                  className="group relative overflow-hidden text-lg px-8 py-6"
                >
                  <Link href="/cv" className="relative z-10">
                    <span className="relative z-10">{t('viewCV')}</span>
                    <span className="absolute inset-0 bg-primary/20 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg"
                  className="group relative overflow-hidden text-lg px-8 py-6"
                >
                  <Link href="/portfolio" className="relative z-10">
                    <span className="relative z-10">{t('viewPortfolio')}</span>
                    <span className="absolute inset-0 bg-primary/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Made with Bob
