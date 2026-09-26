"use client";

import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import Link from "next/link";

import ProjectCard, { type ProjectCardData } from "../showcase/ProjectCard";

export default function ProjectDisplay() {
  const t = useTranslations("ui");

  const [projects, setProjects] = useState<ProjectCardData[]>([]);
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
    <section className="mb-8">
      <div>
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-foreground flex items-center gap-2 text-xl font-bold tracking-wide">
            <span>{t("projectShowcase")}</span>
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
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
