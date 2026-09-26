import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernVersionItem from "./ModernVersionItem";
import logData from "@/data/update-log/log.json";

export default function Page() {
  const t = useTranslations("ui");
  const content = useTranslations("content");

  const log = logData as {
    version: string;
    date: string;
    update: (string | [string, string])[];
  }[];
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="text-foreground mb-2 text-3xl font-bold">
          {t("changelog")}
        </h1>
        <p className="text-muted-foreground">
          {t("recentFeaturesAndImprovementsInSjaPlus")}
        </p>
      </div>

      {/* Timeline */}
      <div className="mx-auto max-w-4xl">
        <div className="space-y-6">
          {log.map((version, index) => (
            <ModernVersionItem
              key={version.version}
              version={version.version}
              date={version.date}
              update={version.update.map((item) =>
                Array.isArray(item)
                  ? [item[0], content(item[1])]
                  : content(item),
              )}
              isFirst={index === 0}
              isLast={index === log.length - 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
