"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function Portfolio() {
  const t = useTranslations('portfolio');
  const [selectedCategory, setSelectedCategory] = useState("all");

  const projects = [
    // Computer Science Projects
    {
      id: "ibm-watsonx",
      titleKey: "ibmWatsonx.title",
      category: "Computer Science",
      descriptionKey: "ibmWatsonx.description",
      period: "Sep. 2025 - Present",
      technologies: ["React", "TypeScript", "Node.js", "Carbon Design", "LLM Evaluation"],
      confidential: true
    },
    {
      id: "phytolith-cv",
      titleKey: "phytolithCV.title",
      category: "Computer Science",
      descriptionKey: "phytolithCV.description",
      period: "Nov. 2025 - Present",
      technologies: ["Python", "PyTorch", "YOLOv8", "ResNet", "Vision Transformer"],
      confidential: true
    },
    {
      id: "utbook",
      titleKey: "utbook.title",
      category: "Computer Science",
      descriptionKey: "utbook.description",
      period: "2024 - 2025",
      technologies: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL", "Docker"],
      demo: "https://utbook.utm.utoronto.ca/login",
      isProduct: true
    },
    {
      id: "ta-platform",
      titleKey: "taPlatform.title",
      category: "Computer Science",
      descriptionKey: "taPlatform.description",
      period: "2024",
      technologies: ["Next.js", "React", "TypeScript", "Prisma", "PostgreSQL"],
      demo: "https://utapcsc.utm.utoronto.ca/utap/",
      isProduct: true
    },
    {
      id: "auction-platform",
      titleKey: "auctionPlatform.title",
      category: "Computer Science",
      descriptionKey: "auctionPlatform.description",
      period: "May 2024 - Sep. 2024",
      technologies: ["React", "JavaScript", "Material UI", "Django REST", "PostgreSQL"],
      confidential: true
    },
    {
      id: "animal-rescue",
      titleKey: "animalRescue.title",
      category: "Computer Science",
      descriptionKey: "animalRescue.description",
      period: "Sep. 2023 - Present",
      technologies: ["HTML", "JavaScript", "PHP", "Laravel", "MySQL", "Cypress"],
      demo: "https://www.savefurpets.com/",
      isProduct: true
    },
    {
      id: "teaching-tools",
      titleKey: "teachingTools.title",
      category: "Computer Science",
      descriptionKey: "teachingTools.description",
      period: "Winter 2025",
      technologies: ["TypeScript", "React", "Tailwind CSS", "Vitest", "GitHub Classroom"]
    },
    {
      id: "food-classification",
      titleKey: "foodClassification.title",
      category: "Computer Science",
      descriptionKey: "foodClassification.description",
      period: "Winter 2025",
      technologies: ["Python", "scikit-learn", "NumPy", "Pandas", "Machine Learning"]
    },
    // Statistics Projects
    {
      id: "vehicle-theft",
      titleKey: "vehicleTheft.title",
      category: "statistics",
      descriptionKey: "vehicleTheft.description",
      period: "Jan. 2024 - Apr. 2024",
      technologies: ["R", "Multiple Regression", "Data Visualization", "Shiny"],
      github: "https://github.com/FXXFERMI/Economics-and-Crime-Patterns",
      demo: "https://siqi-fei.shinyapps.io/VehicleTheft_Inflation/"
    },
    {
      id: "election-forecast",
      titleKey: "electionForecast.title",
      category: "statistics",
      descriptionKey: "electionForecast.description",
      period: "Jan. 2024 - Apr. 2024",
      technologies: ["R", "Statistical Modeling", "CCES Dataset", "Predictive Analysis"],
      github: "https://github.com/FXXFERMI/Political-support-in-the-United-States"
    },
    {
      id: "nfl-prediction",
      titleKey: "nflPrediction.title",
      category: "statistics",
      descriptionKey: "nflPrediction.description",
      period: "Jan. 2024 - Apr. 2024",
      technologies: ["R", "Machine Learning", "EPA Metrics", "Sports Analytics"],
      github: "https://github.com/FXXFERMI/NLP_pred"
    },
    {
      id: "football-modeling",
      titleKey: "footballModeling.title",
      category: "statistics",
      descriptionKey: "footballModeling.description",
      period: "Jan. 2024 - Apr. 2024",
      technologies: ["R", "Poisson Regression", "Negative Binomial", "Bundesliga Data"],
      github: "https://github.com/FXXFERMI/Modelling_association_football_scores"
    },
    {
      id: "holocaust-viz",
      titleKey: "holocaustViz.title",
      category: "statistics",
      descriptionKey: "holocaustViz.description",
      period: "Jun. 2023 - Sep. 2023",
      technologies: ["R Shiny", "Interactive Visualization", "Ethical Data Presentation"],
      github: "https://github.com/FXXFERMI/Shiny-Visualization",
      demo: "https://siqi-fei.shinyapps.io/Holocaust_Victims/"
    },
  ];

  const categories = [
    { key: "all", label: t('categories.all') },
    { key: "statistics", label: t('categories.statistics') },
    { key: "Computer Science", label: t('categories.Computer Science') }
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category.key}
              variant={selectedCategory === category.key ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.key)}
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects
            .filter((project) =>
              selectedCategory === "all" || project.category === selectedCategory
            )
            .map((project) => (
            <div
              key={project.id}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="space-y-4">
                {/* Category and Period */}
                <div className="flex justify-between items-start">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {project.category}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {project.period}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold">
                  {t(project.titleKey)}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {t(project.descriptionKey)}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech) => (
                    <span
                      key={tech}
                      className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-2 pt-2">
                  {project.confidential ? (
                    <div className="w-full text-center py-2 px-3 text-xs text-muted-foreground bg-muted/50 rounded">
                      {t('confidential')}
                    </div>
                  ) : (
                    <>
                      {project.github && (
                        <Button asChild variant="outline" size="sm" className="flex-1">
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            {t('viewGithub')}
                          </a>
                        </Button>
                      )}
                      {project.demo && (
                        <Button asChild size="sm" className="flex-1">
                          <a href={project.demo} target="_blank" rel="noopener noreferrer">
                            {project.isProduct ? t('viewProduct') : t('viewDemo')}
                          </a>
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-6 rounded-lg border border-border bg-muted/50 text-center">
          <h2 className="text-2xl font-semibold mb-3">{t('cta.title')}</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            {t('cta.description')}
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/cv">{t('cta.viewCV')}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">{t('cta.learnMore')}</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
