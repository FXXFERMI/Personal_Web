"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const people = [
  "Bushra",
  "Eknoor",
  "Kamran",
  "Kunal",
  "Anmol",
  "Chris",
  "Ricky",
  "Jay",
  "Daniel",
  "Patrick",
  "Alvin",
  "Wener"
];

export default function IBMPage() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 text-foreground">
            IBM Team Directory
          </h1>
          <p className="text-xl text-muted-foreground">
            Select a team member to view their profile
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {people.map((person, index) => (
            <Link
              key={person}
              href={`/IBM/${person}`}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="relative overflow-hidden rounded-lg bg-card border border-border shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 hover:border-foreground/30">
                <div className="aspect-square bg-gradient-to-br from-muted to-muted/50 flex items-center justify-center p-6">
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-foreground/90 to-foreground/70 flex items-center justify-center text-background text-3xl font-bold shadow-lg">
                      {person.charAt(0)}
                    </div>
                    <h2 className="text-2xl font-bold text-foreground group-hover:text-foreground/80 transition-colors">
                      {person}
                    </h2>
                  </div>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center animate-fade-in-up animation-delay-1200">
          <Button asChild variant="outline" size="lg">
            <Link href="/" className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob