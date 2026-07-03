'use client';

import { useTheme } from './theme-provider';
import Image from 'next/image';
import { useState, useEffect } from 'react';

interface FlipCardProps {
  frontImage: string;
  logoLight: string;
  logoDark: string;
  alt: string;
  className?: string;
}

export default function FlipCard({
  frontImage,
  logoLight,
  logoDark,
  alt,
  className = '',
}: FlipCardProps) {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState(logoLight);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    const updateLogo = () => {
      if (theme === 'system') {
        const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setLogoSrc(isDark ? logoDark : logoLight);
      } else {
        setLogoSrc(theme === 'dark' ? logoDark : logoLight);
      }
    };

    updateLogo();

    // Listen for system theme changes if theme is 'system'
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => updateLogo();
      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme, logoLight, logoDark, mounted]);

  return (
    <div className={`flip-card-container ${className}`}>
      <div className="flip-card">
        {/* Front of card - Profile Photo */}
        <div className="flip-card-front">
          <Image
            src={frontImage}
            alt={alt}
            width={680}
            height={680}
            className="w-full h-full object-cover"
            priority
          />
        </div>
        
        {/* Back of card - Logo */}
        <div className="flip-card-back">
          <div className="flex items-center justify-center w-full h-full bg-gradient-to-br from-primary/10 to-accent/10">
            {mounted && (
              <Image
                src={logoSrc}
                alt="Logo"
                width={800}
                height={800}
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob