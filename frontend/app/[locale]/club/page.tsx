import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Club() {
  const t = useTranslations('club');

  const clubs = [
    {
      name: "Tech Innovation Club",
      role: "Member",
      period: "2023 - Present",
      description: "Participating in hackathons and tech workshops, collaborating on innovative projects.",
    },
    {
      name: "Data Science Society",
      role: "Active Participant",
      period: "2022 - Present",
      description: "Engaging in data analysis projects and learning advanced statistical methods.",
    },
    {
      name: "Sports Club",
      role: "Team Member",
      period: "2021 - Present",
      description: "Staying active and building teamwork skills through regular sports activities.",
    },
  ];

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

        <div className="space-y-6">
          {clubs.map((club, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-2 mb-3">
                <h2 className="text-2xl font-semibold">{club.name}</h2>
                <span className="text-sm text-muted-foreground">{club.period}</span>
              </div>
              <p className="text-sm font-medium text-primary mb-2">{club.role}</p>
              <p className="text-muted-foreground leading-relaxed">
                {club.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-lg border border-border bg-muted/50">
          <h2 className="text-2xl font-semibold mb-4">Why Clubs Matter</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Being involved in clubs has helped me develop essential skills beyond academics, 
            including leadership, teamwork, and time management. These experiences have shaped 
            my personal and professional growth.
          </p>
          <div className="flex gap-4">
            <Button asChild>
              <Link href="/about">Learn More About Me</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/portfolio">View My Projects</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
