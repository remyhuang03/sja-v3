"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useRequestJSON } from "@/lib/api";
import type { Website } from "@/lib/websites";
import sites from "@/data/nav/sites.json";
import categories from "@/data/nav/cates.json";
import NavSection from "./NavSection";
import { Button } from "@/components/ui/button";

export default function ResourceDirectory() {
  const content = useTranslations("content");
  const t = useTranslations("ui");
  const request = useRequestJSON();
  const [approved, setApproved] = useState<Website[]>([]);
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let active = true;
    request<Website[]>("/api/v2/websites")
      .then((rows) => {
        if (active) {
          setApproved(rows);
          setError(false);
        }
      })
      .catch(() => {
        if (active) setError(true);
      });
    return () => {
      active = false;
    };
  }, [request, retry]);
  const data: Record<string, string[]> = sites;
  return (
    <div className="space-y-10">
      {error && (
        <div
          role="status"
          className="text-muted-foreground flex flex-wrap items-center gap-3 text-sm"
        >
          {t("websiteLoadError")}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRetry((n) => n + 1)}
          >
            {t("refresh")}
          </Button>
        </div>
      )}
      {Object.entries(categories).map(([category, { show }]) => {
        const existing: Website[] = show.map((id) => ({
          id: `seed-${id}`,
          name: data[id][0],
          url: data[id][1],
          category,
          description: "",
          icon_path: `/site-icons/${id}.png`,
        }));
        const known = new Set(existing.map((site) => new URL(site.url).href));
        return (
          <NavSection
            key={category}
            cate={content(`category_${category}`)}
            items={[
              ...existing,
              ...approved.filter(
                (site) => site.category === category && !known.has(site.url),
              ),
            ]}
          />
        );
      })}
    </div>
  );
}
