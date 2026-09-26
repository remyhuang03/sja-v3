import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import HomeIcons from "./components/HomeIcons";
import newsList from "@/data/news/news-info.json";

function ProjectIllustration() {
  return (
    <svg
      viewBox="0 0 440 380"
      fill="none"
      className="w-full"
      aria-hidden="true"
    >
      <defs>
        <pattern
          id="project-grid"
          width="28"
          height="28"
          patternUnits="userSpaceOnUse"
        >
          <circle cx="1" cy="1" r="1" fill="currentColor" opacity=".12" />
        </pattern>
      </defs>
      <rect width="440" height="380" fill="url(#project-grid)" />
      <path
        d="M220 52v36M220 292v36M64 190h40M336 190h40"
        stroke="currentColor"
        opacity=".18"
      />
      <g strokeLinejoin="round" strokeWidth="1.5">
        <path
          d="m100 224 120-65 120 65-120 65-120-65Z"
          className="fill-background stroke-border"
        />
        <path
          d="M100 224v22l120 65 120-65v-22M220 289v22"
          className="stroke-border"
        />
        <path
          d="m100 170 120-65 120 65-120 65-120-65Z"
          className="fill-background stroke-primary/50"
        />
        <path
          d="M100 170v22l120 65 120-65v-22M220 235v22"
          className="stroke-primary/40"
        />
        <path
          d="m100 116 120-65 120 65-120 65-120-65Z"
          className="fill-primary/10 stroke-primary"
        />
        <path
          d="M100 116v22l120 65 120-65v-22M220 181v22"
          className="stroke-primary/60"
        />
        <path
          d="m163 116 57-31 57 31-57 31-57-31Z"
          className="fill-primary/15 stroke-primary/70"
        />
        <path
          d="m205 107-15 9 15 9m30-18 15 9-15 9m-10-21-10 24"
          className="stroke-primary"
          strokeLinecap="round"
        />
      </g>
      <circle cx="64" cy="190" r="3" className="fill-primary" />
      <circle cx="376" cy="190" r="3" className="fill-primary" />
    </svg>
  );
}

export default function Home() {
  const t = useTranslations("ui");
  const content = useTranslations("content");
  return (
    <div className="mx-auto max-w-6xl px-6 sm:px-10">
      <section className="grid items-center gap-8 pt-16 pb-16 sm:pt-24 sm:pb-24 lg:grid-cols-[1.3fr_1fr] lg:gap-16">
        <div>
          <p className="text-muted-foreground mb-6 flex items-center gap-3 text-xs font-medium tracking-[0.16em]">
            <span className="bg-primary h-1.5 w-1.5 rounded-full" />
            {t("homeEyebrow")}
          </p>
          <h1 className="max-w-2xl text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl lg:text-[3.5rem]">
            {t("homeTitle")}
            <br />
            <span className="text-primary">{t("homeTitleAccent")}</span>
          </h1>
          <p className="text-muted-foreground mt-6 max-w-lg text-base leading-8 text-pretty">
            {t("homeDescription")}
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Button
              asChild
              size="lg"
              className="h-12 rounded-full px-6 shadow-none"
            >
              <Link href="/analyze">
                {t("analyzeProject")}
                <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="lg"
              className="h-12 rounded-full px-5"
            >
              <Link href="/compare">
                {t("projectSimilarity")}
                <ArrowUpRight aria-hidden="true" />
              </Link>
            </Button>
          </div>
          <p className="text-muted-foreground mt-6 font-mono text-xs tracking-wide">
            .sb3 / .cc3 / .json
          </p>
        </div>
        <div className="text-foreground mx-auto hidden w-full max-w-sm sm:block lg:max-w-none">
          <ProjectIllustration />
        </div>
      </section>
      <HomeIcons />
      <section
        className="grid gap-8 py-16 sm:py-20 lg:grid-cols-[1fr_2fr] lg:gap-16"
        aria-labelledby="news-heading"
      >
        <div>
          <h2
            id="news-heading"
            className="text-2xl font-semibold tracking-tight"
          >
            {t("latestNews")}
          </h2>
          <p className="text-muted-foreground mt-3 text-sm leading-7">
            {t("homeNewsDescription")}
          </p>
          <Link
            href="/update-log"
            className="hover:text-primary focus-visible:outline-ring mt-6 inline-flex items-center gap-2 text-sm focus-visible:rounded focus-visible:outline-2"
          >
            {t("changelog")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
        <div className="divide-border border-border divide-y border-y">
          {newsList.map((news) => (
            <Link
              key={news.article}
              href={`/news?a=${news.article}`}
              className="group focus-visible:outline-ring flex items-center gap-6 py-6 focus-visible:outline-2"
            >
              <div className="min-w-0 flex-1">
                <h3 className="group-hover:text-primary text-base leading-7 font-medium transition-colors">
                  {content(news.titleKey)}
                </h3>
                <p className="text-muted-foreground mt-1 line-clamp-2 text-sm leading-6">
                  {content(news.descriptionKey)}
                </p>
              </div>
              <ArrowUpRight
                className="text-muted-foreground group-hover:text-primary h-4 w-4 shrink-0 transition-colors"
                aria-hidden="true"
              />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
