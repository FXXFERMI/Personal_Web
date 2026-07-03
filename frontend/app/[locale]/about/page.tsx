import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function About() {
  const t = useTranslations('about');

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

        <div className="prose prose-lg dark:prose-invert max-w-none">
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold">Background</h2>
            <p className="text-muted-foreground leading-relaxed">
              I'm Siqi Fei, a passionate professional with a strong background in technology and innovation. 
              My journey has been driven by curiosity and a desire to create meaningful solutions that make a difference.
            </p>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Skills & Expertise</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2">Technical Skills</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Web Development</li>
                  <li>• Data Analysis</li>
                  <li>• Software Engineering</li>
                  <li>• Problem Solving</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card">
                <h3 className="font-semibold mb-2">Soft Skills</h3>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Team Collaboration</li>
                  <li>• Communication</li>
                  <li>• Leadership</li>
                  <li>• Critical Thinking</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="space-y-4 mt-8">
            <h2 className="text-2xl font-semibold">Interests</h2>
            <p className="text-muted-foreground leading-relaxed">
              Beyond my professional work, I'm passionate about continuous learning, exploring new technologies, 
              and contributing to community projects. I enjoy staying active, reading, and connecting with like-minded individuals.
            </p>
          </section>
        </div>

        <div className="flex gap-4 pt-8">
          <Button asChild>
            <Link href="/cv">View My CV</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/portfolio">See My Work</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
