import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Upload } from "lucide-react";
import ModernNavSection from "./NavSection";
import categories from "@/data/nav/cates.json";

export default function Page() {
  const t = useTranslations("ui");
  const content = useTranslations("content");

  const cates: Record<string, { show: number[] }> = categories;
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          {t("sjaResources")}
        </h1>
        <p className="text-muted-foreground">
          {t("discoverScratchWebsitesAndResources")}
        </p>
      </div>

      {/* Submit Button */}
      <div className="mb-8 flex justify-end">
        <Button asChild className="gap-2">
          <a
            href="https://www.wenjuan.com/s/UZBZJvXfgl/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Upload className="h-4 w-4" />
            {t("suggestAWebsite")}
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </div>

      {/* Categories */}
      <div className="space-y-8">
        {Object.keys(cates).map((cate) => (
          <ModernNavSection
            key={cate}
            cate={content(`category_${cate}`)}
            items={cates[cate].show}
          />
        ))}
      </div>
    </div>
  );
}
