"use client";

import Link from "next/link";
import { use } from "react";
import { Button } from "@/components/ui/button";

const peopleData: Record<string, { title: string; description: string }> = {
  Bushra: {
    title: "Software Engineer",
    description: "Passionate about building scalable applications and solving complex problems."
  },
  Eknoor: {
    title: "Data Scientist",
    description: "Specializing in machine learning and data analytics."
  },
  Kamran: {
    title: "Full Stack Developer",
    description: "Creating seamless user experiences with modern web technologies."
  },
  Kunal: {
    title: "DevOps Engineer",
    description: "Automating infrastructure and optimizing deployment pipelines."
  },
  Anmol: {
    title: "Backend Developer",
    description: "Building robust APIs and microservices architecture."
  },
  Chris: {
    title: "Frontend Developer",
    description: "Crafting beautiful and responsive user interfaces."
  },
  Ricky: {
    title: "Cloud Architect",
    description: "Designing scalable cloud infrastructure solutions."
  },
  Jay: {
    title: "Security Engineer",
    description: "Ensuring application security and data protection."
  },
  Daniel: {
    title: "Product Manager",
    description: "Driving product vision and strategy."
  },
  Patrick: {
    title: "UX Designer",
    description: "Creating intuitive and delightful user experiences."
  },
  Alvin: {
    title: "Mobile Developer",
    description: "Building native and cross-platform mobile applications."
  },
  Wener: {
    title: "AI Engineer",
    description: "Developing intelligent systems and neural networks."
  }
};

export default function PersonPage({ params }: { params: Promise<{ name: string }> }) {
  const { name } = use(params);
  const personData = peopleData[name] || { title: "Team Member", description: "IBM Team Member" };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-8 animate-fade-in-up">
          <Button asChild variant="outline">
            <Link href="/IBM" className="inline-flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Directory
            </Link>
          </Button>
        </div>

        {/* Profile Card */}
        <div className="bg-card border border-border rounded-lg shadow-2xl overflow-hidden animate-fade-in-up animation-delay-200">
          {/* Header Section */}
          <div className="relative h-48 bg-gradient-to-r from-foreground/90 to-foreground/70">
            <div className="absolute inset-0 bg-gradient-to-br from-foreground/5 to-transparent"></div>
          </div>

          {/* Profile Content */}
          <div className="relative px-8 pb-8">
            {/* Avatar */}
            <div className="relative -mt-20 mb-6">
              <div className="w-40 h-40 rounded-full bg-gradient-to-br from-foreground/90 to-foreground/70 flex items-center justify-center text-background text-6xl font-bold shadow-2xl border-8 border-card">
                {name.charAt(0)}
              </div>
            </div>

            {/* Name and Title */}
            <div className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold mb-2 text-foreground">
                {name}
              </h1>
              <p className="text-xl text-muted-foreground font-semibold">
                {personData.title}
              </p>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">About</h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                {personData.description}
              </p>
            </div>

            {/* Placeholder Images Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4 text-foreground">Gallery</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-muted flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-border"
                    style={{ animationDelay: `${i * 0.1}s` }}
                  >
                    <div className="text-center">
                      <svg className="w-16 h-16 mx-auto mb-2 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-sm text-muted-foreground">Image {i}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-6 rounded-lg bg-muted border border-border hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Department</h3>
                <p className="text-muted-foreground">IBM Technology</p>
              </div>
              <div className="p-6 rounded-lg bg-muted border border-border hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-lg font-semibold mb-2 text-foreground">Location</h3>
                <p className="text-muted-foreground">Toronto, ON</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Content Section */}
        <div className="mt-8 bg-card border border-border rounded-lg shadow-xl p-8 animate-fade-in-up animation-delay-400">
          <h2 className="text-2xl font-bold mb-4 text-foreground">Recent Projects</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-4 rounded-lg bg-muted hover:bg-muted/80 transition-colors duration-200 border border-border"
              >
                <h3 className="font-semibold text-lg mb-1 text-foreground">
                  Project {i}
                </h3>
                <p className="text-muted-foreground">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob