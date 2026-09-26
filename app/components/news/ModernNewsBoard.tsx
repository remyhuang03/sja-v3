import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernNewsItem from "./ModernNewsItem";

import newsList from "@/data/news/news-info.json";

export default function ModernNewsBoard() {
  const t = useTranslations("ui");
  const content = useTranslations("content");

  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold">{t("latestNews")}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-3">
          {newsList.map((news, index) => (
            <ModernNewsItem
              key={news.article}
              article={news.article}
              title={content(news.titleKey)}
              description={content(news.descriptionKey)}
              thumbnail={news.thumbnail}
              isLast={index === newsList.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
