import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function CV() {
  const t = useTranslations('cv');

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xl text-muted-foreground">
            {t('description')}
          </p>
        </div>

        {/* Education */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            Education
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">University Name</h3>
                <span className="text-sm text-muted-foreground">2020 - 2024</span>
              </div>
              <p className="text-primary font-medium">Bachelor's Degree in Computer Science</p>
              <p className="text-muted-foreground mt-2">
                Relevant coursework: Data Structures, Algorithms, Web Development, Database Systems
              </p>
            </div>
          </div>
        </section>

        {/* Experience */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            Experience
          </h2>
          <div className="space-y-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">Software Developer</h3>
                <span className="text-sm text-muted-foreground">2023 - Present</span>
              </div>
              <p className="text-primary font-medium mb-2">Tech Company</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Developed and maintained web applications</li>
                <li>Collaborated with cross-functional teams</li>
                <li>Implemented new features and optimized performance</li>
              </ul>
            </div>

            <div className="p-4 rounded-lg border border-border bg-card">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-2">
                <h3 className="text-xl font-semibold">Intern Developer</h3>
                <span className="text-sm text-muted-foreground">2022 - 2023</span>
              </div>
              <p className="text-primary font-medium mb-2">Startup Company</p>
              <ul className="list-disc list-inside text-muted-foreground space-y-1">
                <li>Assisted in building web applications</li>
                <li>Learned industry best practices</li>
                <li>Contributed to team projects</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold border-b border-border pb-2">
            Skills
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border border-border bg-card">
              <h3 className="font-semibold mb-3">Programming Languages</h3>
              <div className="flex flex-wrap gap-2">
                {["JavaScript", "TypeScript", "Python", "R", "SQL"].map((skill) => (
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
              <h3 className="font-semibold mb-3">Technologies & Tools</h3>
              <div className="flex flex-wrap gap-2">
                {["React", "Next.js", "Node.js", "Git", "Docker"].map((skill) => (
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

        {/* Download CV */}
        <div className="mt-8 p-6 rounded-lg border border-border bg-muted/50">
          <h2 className="text-xl font-semibold mb-3">Download Full CV</h2>
          <p className="text-muted-foreground mb-4">
            Get a detailed PDF version of my curriculum vitae.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <a href="/Siqi Fei_Resume.pdf" download>
                Download PDF
              </a>
            </Button>
            <Button asChild variant="outline">
              <Link href="/portfolio">View Portfolio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
