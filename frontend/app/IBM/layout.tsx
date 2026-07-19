import type { Metadata } from "next";
import "../globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeScript } from "@/components/theme-script";

export const metadata: Metadata = {
  title: "IBM Team Directory",
  description: "IBM Team Member Directory",
};

export default function IBMLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <ThemeScript />
      <ThemeProvider
        defaultTheme="system"
        storageKey="siqi-fei-theme"
      >
        <main className="min-h-full flex flex-col font-serif flex-1">{children}</main>
      </ThemeProvider>
    </>
  );
}

// Made with Bob