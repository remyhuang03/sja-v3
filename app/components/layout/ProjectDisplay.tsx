"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";

interface Project {
  id: string;
  name: string;
  author: string;
  author_link: string;
  project_link: string;
  cover_image_path: string;
  avatar_image_path: string;
  brief: string;
}

export default function ProjectDisplay() {
  const t = useTranslations("ui");

  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/v2/projects-display?n=5", {
          cache: "no-store",
        });
        if (response.ok) {
          const data = await response.json();
          setProjects(data);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  }, []);

  return (
    <Card className="mb-8">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-wide">
            🐱 <span>{t("projectShowcase")}</span>
          </h2>
          <div className="flex gap-3">
            <Link
              href="/project-display-apply"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary text-sm transition-colors"
            >
              {t("submitAProject")}
            </Link>
          </div>
        </div>

        {/* Projects */}
        {loading ? (
          <div className="custom-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto py-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="border-border/50 bg-card/60 w-56 flex-shrink-0 animate-pulse snap-start overflow-hidden rounded-xl border"
              >
                <div className="flex gap-3 p-3">
                  <div className="bg-muted-foreground/15 h-9 w-9 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="bg-muted-foreground/15 h-3 w-4/5 rounded" />
                    <div className="bg-muted-foreground/15 h-2 w-2/3 rounded" />
                  </div>
                </div>
                <div className="bg-muted-foreground/10 aspect-[4/3]" />
                <div className="p-3">
                  <div className="bg-muted-foreground/15 h-2 w-full rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-muted-foreground py-4 text-center">
            <p>{t("couldNotLoadProjects")}</p>
          </div>
        ) : projects.length === 0 ? (
          <p className="text-muted-foreground py-4 text-sm">
            {t("noProjectsYetBeTheFirstToSubmitYours")}
          </p>
        ) : (
          <div className="custom-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto py-4">
            {projects.map((project) => (
              <div
                key={project.id}
                className="group border-border/60 hover:shadow-primary/20 ring-border/40 hover:ring-primary/50 w-56 flex-shrink-0 snap-start overflow-hidden rounded-2xl border bg-[hsl(var(--card)_/_85%)] shadow-md ring-1 transition-colors duration-500 hover:bg-[hsl(var(--card)_/_95%)]"
              >
                {/* Author and Project Info */}
                <div className="flex items-center gap-3 p-3 pb-2">
                  <Link
                    href={project.author_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0"
                  >
                    <Image
                      width={36}
                      height={36}
                      src={project.avatar_image_path}
                      className="ring-primary/30 h-9 w-9 rounded-full object-cover ring-2"
                      alt={project.author}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link
                      href={project.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <h3 className="group-hover:text-primary line-clamp-1 text-sm font-semibold tracking-wide text-white">
                        {project.name}
                      </h3>
                    </Link>
                    <Link
                      href={project.author_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <p className="text-muted-foreground hover:text-primary/80 truncate text-xs leading-tight">
                        {project.author}
                      </p>
                    </Link>
                  </div>
                </div>

                {/* Project Poster */}
                <Link
                  href={project.project_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                    <Image
                      width={224}
                      height={168}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] group-hover:rotate-[0.3deg]"
                      src={project.cover_image_path}
                      alt={project.name}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = "none";
                      }}
                    />
                    <div className="from-background/40 via-background/5 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>
                </Link>

                {/* Brief */}
                <div className="p-3 pt-2">
                  <p className="text-muted-foreground line-clamp-2 min-h-[2.9rem] text-[12px] leading-relaxed">
                    {project.brief || t("noDescription")}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
