"use client";

import { useTranslations } from "next-intl";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ToolCardProps {
  title: string;
  href: string;
  icon: string;
  description?: string;
  disabled?: boolean;
  variant?:
    "default" | "analyze" | "compare" | "display" | "nav" | "update" | "faq";
}

const ToolCard = ({
  title,
  href,
  icon,
  description,
  disabled = false,
  variant = "default",
}: ToolCardProps) => {
  const t = useTranslations("ui");

  const variantStyles = {
    analyze:
      "bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-purple-500/20 hover:border-purple-400/40 hover:shadow-lg hover:shadow-purple-500/20",
    compare:
      "bg-gradient-to-br from-blue-500/20 to-blue-600/10 border-blue-500/20 hover:border-blue-400/40 hover:shadow-lg hover:shadow-blue-500/20",
    display:
      "bg-gradient-to-br from-pink-500/20 to-purple-600/10 border-pink-500/20 hover:border-pink-400/40 hover:shadow-lg hover:shadow-pink-500/20",
    nav: "bg-gradient-to-br from-orange-500/20 to-red-600/10 border-orange-500/20 hover:border-orange-400/40 hover:shadow-lg hover:shadow-orange-500/20",
    update:
      "bg-gradient-to-br from-gray-500/20 to-gray-600/10 border-gray-500/20 hover:border-gray-400/40 hover:shadow-lg hover:shadow-gray-500/20",
    faq: "bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border-emerald-500/20 hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/20",
    default:
      "bg-gradient-to-br from-muted/50 to-muted/20 border-muted hover:border-muted-foreground/20",
  };

  const content = (
    <Card
      className={cn(
        "group relative overflow-hidden transition-all duration-300 hover:scale-[1.02]",
        variantStyles[variant],
        disabled && "cursor-not-allowed opacity-60",
      )}
    >
      <CardContent className="flex items-center p-6">
        <div className="mr-4 flex-shrink-0">
          <div
            className="h-16 w-16 bg-contain bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${icon})` }}
          />
        </div>
        <div className="flex-1">
          <h3 className="text-card-foreground group-hover:text-primary text-lg font-semibold transition-colors">
            {disabled ? <del>{title}</del> : title}
          </h3>
          {description && (
            <p className="text-muted-foreground mt-1 text-sm">{description}</p>
          )}
          {disabled && (
            <Badge variant="secondary" className="mt-2 text-xs">
              {t("comingSoon")}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (disabled) {
    return <div onClick={(e) => e.preventDefault()}>{content}</div>;
  }

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
};

export default function HomeIcons() {
  const t = useTranslations("ui");

  const tools = [
    {
      title: t("projectAnalyzer"),
      href: "/analyze",
      icon: "/homepage/analyze-logo.svg",
      description: t("exploreTheStructureOfYourScratchProject"),
      variant: "analyze" as const,
    },
    {
      title: t("projectSimilarity"),
      href: "/compare",
      icon: "/homepage/cmpr-logo.svg",
      description: t("compareBlockTypesAndConnections"),
      disabled: false,
      variant: "compare" as const,
    },
    {
      title: t("resources"),
      href: "/nav",
      icon: "/homepage/nav-logo.svg",
      description: t("usefulLinksForScratchCreators"),
      variant: "nav" as const,
    },
    {
      title: t("changelog"),
      href: "/update-log",
      icon: "/homepage/update-log-logo.svg",
      description: t("seeTheLatestFeaturesAndImprovements"),
      variant: "default" as const,
    },
    {
      title: t("faq"),
      href: "https://note.youdao.com/s/80ZZTzYW",
      icon: "/homepage/faq-logo.svg",
      description: t("findHelpAndAnswers"),
      variant: "default" as const,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h2 className="text-foreground mb-2 text-2xl font-bold">
          {t("tools")}
        </h2>
        <p className="text-muted-foreground">{t("chooseAToolToGetStarted")}</p>
      </div>

      <div className="grid gap-4">
        {tools.map((tool) => (
          <ToolCard
            key={tool.title}
            title={tool.title}
            href={tool.href}
            icon={tool.icon}
            description={tool.description}
            disabled={tool.disabled}
            variant={tool.variant}
          />
        ))}
      </div>
    </div>
  );
}
