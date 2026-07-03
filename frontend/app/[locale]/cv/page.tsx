import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function CV() {
  const t = useTranslations('cv');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        {/* Header Section */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            <a href="mailto:fermi.fei@mail.utoronto.ca" className="hover:text-primary transition-colors">
              fermi.fei@mail.utoronto.ca
            </a>
            <span className="hidden md:inline">•</span>
            <a href="tel:437-362-5444" className="hover:text-primary transition-colors">
              437-362-5444
            </a>
            <span className="hidden md:inline">•</span>
            <a href="https://www.linkedin.com/in/siqi-fermi-fei" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              LinkedIn
            </a>
            <span className="hidden md:inline">•</span>
            <a href="https://github.com/FXXFERMI" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              GitHub
            </a>
          </div>
        </div>

        {/* Download CV */}
        <div className="p-6 rounded-lg border border-border bg-card/50 backdrop-blur-sm">
          <h2 className="text-xl font-semibold mb-3">{t('download.title')}</h2>
          <p className="text-muted-foreground mb-4">
            {t('download.description')}
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <a href="/Siqi_Fei_Resume_2026.pdf" download="Siqi_Fei_Resume_2026.pdf">
                {t('download.button')}
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/portfolio">{t('download.viewPortfolio')}</Link>
            </Button>
          </div>
        </div>

        {/* Education */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            {t('education.title')}
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('education.school')}</h3>
                <span className="text-sm text-muted-foreground">{t('education.graduation')}</span>
              </div>
              <p className="text-primary font-medium">{t('education.degree')}</p>
              <p className="text-muted-foreground mt-2">
                {t('education.awards')}
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            {t('experience.title')}
          </h2>
          <div className="space-y-4">
            {/* IBM WatsonX Bob Core */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('experience.ibmBob.title')}</h3>
                <span className="text-sm text-muted-foreground">{t('experience.ibmBob.period')}</span>
              </div>
              <p className="text-primary font-medium mb-2">{t('experience.ibmBob.company')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('experience.ibmBob.point1')}</li>
                <li>{t('experience.ibmBob.point2')}</li>
                <li>{t('experience.ibmBob.point3')}</li>
                <li>{t('experience.ibmBob.point4')}</li>
                <li>{t('experience.ibmBob.point5')}</li>
                <li>{t('experience.ibmBob.point6')}</li>
              </ul>
            </div>

            {/* IBM WatsonX Code Assistant */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('experience.ibmPM.title')}</h3>
                <span className="text-sm text-muted-foreground">{t('experience.ibmPM.period')}</span>
              </div>
              <p className="text-primary font-medium mb-2">{t('experience.ibmPM.company')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('experience.ibmPM.point1')}</li>
                <li>{t('experience.ibmPM.point2')}</li>
                <li>{t('experience.ibmPM.point3')}</li>
                <li>{t('experience.ibmPM.point4')}</li>
              </ul>
            </div>

            {/* University of Toronto TA */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('experience.uoft.title')}</h3>
                <span className="text-sm text-muted-foreground">{t('experience.uoft.period')}</span>
              </div>
              <p className="text-primary font-medium mb-2">{t('experience.uoft.company')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('experience.uoft.point1')}</li>
                <li>{t('experience.uoft.point2')}</li>
                <li>{t('experience.uoft.point3')}</li>
                <li>{t('experience.uoft.point4')}</li>
              </ul>
            </div>

            {/* MintC Auction */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('experience.mintc.title')}</h3>
                <span className="text-sm text-muted-foreground">{t('experience.mintc.period')}</span>
              </div>
              <p className="text-primary font-medium mb-2">{t('experience.mintc.company')}</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('experience.mintc.point1')}</li>
                <li>{t('experience.mintc.point2')}</li>
                <li>{t('experience.mintc.point3')}</li>
                <li>{t('experience.mintc.point4')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Projects */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            {t('projects.title')}
          </h2>
          <div className="space-y-4">
            {/* Ramsey Lab */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('projects.ramseyLab.title')}</h3>
                <span className="text-sm text-muted-foreground">{t('projects.ramseyLab.period')}</span>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('projects.ramseyLab.point1')}</li>
                <li>{t('projects.ramseyLab.point2')}</li>
                <li>{t('projects.ramseyLab.point3')}</li>
              </ul>
            </div>

            {/* ML Model Development */}
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">{t('projects.mlDev.title')}</h3>
                <span className="text-sm text-muted-foreground">{t('projects.mlDev.period')}</span>
              </div>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>{t('projects.mlDev.point1')}</li>
                <li>{t('projects.mlDev.point2')}</li>
                <li>{t('projects.mlDev.point3')}</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            {t('skills.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-3">{t('skills.programming.title')}</h3>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "TypeScript", "Python", "Git", "Linux", "SQL", "HTML", "CSS", "C", "C++", "Java", "React", "Vue", "Django", "PostgreSQL", "R", "SAS", "MATLAB", "Go", "Selenium"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-3">{t('skills.technical.title')}</h3>
              <div className="flex flex-wrap gap-2">
                {["Microsoft Office 365", "Photoshop", "Adobe Creative Suite", "Video Editing"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-3">{t('skills.professional.title')}</h3>
              <div className="flex flex-wrap gap-2">
                {["Leadership", "Team Collaboration", "Problem Solving", "Data Gathering", "Technical Writing", "Critical Thinking", "Active Learning", "Adaptability", "Creativity"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-3">{t('skills.languages.title')}</h3>
              <div className="flex flex-wrap gap-2">
                {["English", "Chinese"].map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

// Made with Bob
