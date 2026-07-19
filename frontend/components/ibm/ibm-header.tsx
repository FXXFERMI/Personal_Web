"use client";

import { ThemeToggle } from "@/components/theme-toggle";
import { useTheme } from "@/components/theme-provider";
import { useEffect, useState } from "react";
import Image from "next/image";

// showLogout: on the /IBM/[name] page — clicking the logo signs out and returns to /IBM.
// Without it (login page): clicking the logo is a plain link to /IBM.
export function IbmHeader({ showLogout = false }: { showLogout?: boolean }) {
  const { theme } = useTheme();
  const [logoSrc, setLogoSrc] = useState("/fermi-logo-light.png");

  useEffect(() => {
    const updateLogo = () => {
      if (theme === "system") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
        setLogoSrc(isDark ? "/fermi-logo-dark.png" : "/fermi-logo-light.png");
      } else {
        setLogoSrc(theme === "dark" ? "/fermi-logo-dark.png" : "/fermi-logo-light.png");
      }
    };

    updateLogo();

    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = () => updateLogo();
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  async function handleLogoClick(e: React.MouseEvent) {
    if (!showLogout) return; // plain link behaviour — let the <a> navigate
    e.preventDefault();
    await fetch("/api/ibm/logout", { method: "POST" });
    window.location.href = "/IBM";
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 animate-slide-down">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <a
            href="/IBM"
            onClick={handleLogoClick}
            className="flex items-center gap-3 hover:opacity-80 transition-opacity"
          >
            <Image
              src={logoSrc}
              alt="IBM Bob Logo"
              width={40}
              height={40}
              className="transition-transform duration-300"
            />
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              IBM Bob
            </span>
          </a>
          <div className="flex items-center gap-3 animate-fade-in animation-delay-600">
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
