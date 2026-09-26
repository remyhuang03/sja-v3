import { useTranslations } from "next-intl";
import Link from "next/link";
import {
  ArrowUpRight,
  GitCompareArrows,
  Compass,
  BookOpen,
} from "lucide-react";

export default function HomeIcons() {
  const t = useTranslations("ui");
  const tools = [
    {
      title: t("projectSimilarity"),
      description: t("compareBlockTypesAndConnections"),
      href: "/compare",
      icon: GitCompareArrows,
    },
    {
      title: t("resources"),
      description: t("usefulLinksForScratchCreators"),
      href: "/nav",
      icon: Compass,
    },
    {
      title: t("faq"),
      description: t("findHelpAndAnswers"),
      href: "https://note.youdao.com/s/80ZZTzYW",
      icon: BookOpen,
    },
  ];
  return (
    <nav
      aria-label={t("tools")}
      className="divide-border border-border grid divide-y border-y md:grid-cols-3 md:divide-x md:divide-y-0"
    >
      {tools.map(({ title, description, href, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          target={href.startsWith("https:") ? "_blank" : undefined}
          rel={href.startsWith("https:") ? "noopener noreferrer" : undefined}
          className="group hover:bg-muted/30 focus-visible:outline-ring px-1 py-8 transition-colors focus-visible:outline-2 md:px-7 md:first:pl-0 md:last:pr-0"
        >
          <div className="flex items-center justify-between gap-4">
            <Icon
              className="text-primary h-5 w-5"
              strokeWidth={1.5}
              aria-hidden="true"
            />
            <ArrowUpRight
              className="text-muted-foreground group-hover:text-primary h-4 w-4"
              aria-hidden="true"
            />
          </div>
          <h2 className="group-hover:text-primary mt-5 text-base font-medium">
            {title}
          </h2>
          <p className="text-muted-foreground mt-2 text-sm leading-6">
            {description}
          </p>
        </Link>
      ))}
    </nav>
  );
}
