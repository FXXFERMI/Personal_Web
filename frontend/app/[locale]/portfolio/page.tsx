import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useTranslations } from 'next-intl';

export default function Portfolio() {
  const t = useTranslations('portfolio');

  const projects = [
    {
      title: "NFL Data Analysis",
      category: "Data Science",
      description: "Comprehensive analysis of NFL statistics and player performance using R and statistical modeling.",
      technologies: ["R", "Data Visualization", "Statistical Analysis"],
      link: "#",
    },
    {
      title: "Shiny Dashboard Application",
      category: "Web Development",
      description: "Interactive web application built with R Shiny for data exploration and visualization.",
      technologies: ["R Shiny", "Interactive Dashboards", "Data Viz"],
      link: "#",
    },
    {
      title: "Computer Science Portfolio",
      category: "Web Development",
      description: "Personal portfolio website showcasing CS projects and technical skills.",
      technologies: ["HTML", "CSS", "JavaScript", "Quarto"],
      link: "#",
    },
    {
      title: "Statistical Analysis Portfolio",
      category: "Data Science",
      description: "Collection of statistical analysis projects demonstrating proficiency in data analysis techniques.",
      technologies: ["R", "Statistics", "Data Analysis"],
      link: "#",
    },
    {
      title: "Election Data Visualization",
      category: "Data Science",
      description: "Visual analysis of election data with interactive charts and insights.",
      technologies: ["R", "ggplot2", "Data Visualization"],
      link: "#",
    },
    {
      title: "Sports Analytics Project",
      category: "Data Science",
      description: "Analysis of sports data including soccer and basketball statistics.",
      technologies: ["Python", "Pandas", "Data Analysis"],
      link: "#",
    },
  ];

  const categories = ["All", "Web Development", "Data Science"];

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
              key={category}
              variant={category === "All" ? "default" : "outline"}
              size="sm"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <div
              key={index}
              className="p-6 rounded-lg border border-border bg-card hover:shadow-lg transition-all hover:-translate-y-1"
            >
              <div className="space-y-3">
                <div>
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-xl font-semibold">{project.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {project.description}
                </p>
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
                <Button asChild variant="outline" size="sm" className="w-full mt-4">
                  <a href={project.link}>View Project</a>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 p-6 rounded-lg border border-border bg-muted/50 text-center">
          <h2 className="text-2xl font-semibold mb-3">Interested in Working Together?</h2>
          <p className="text-muted-foreground mb-4 max-w-2xl mx-auto">
            I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/cv">View My CV</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Made with Bob
