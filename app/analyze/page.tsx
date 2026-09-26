"use client";

import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernAnalyzeMenu from "./AnalyzeMenu";
import ModernAnalyzeResult from "./AnalyzeResult";
import ContextProvider from "./context";

export default function Page() {
  const t = useTranslations("ui");

  return (
    <ContextProvider>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-foreground mb-2 text-3xl font-bold">
            {t("sjaProjectAnalyzer")}
          </h1>
          <p className="text-muted-foreground">
            {t("uploadAScratchProjectForADetailedAnalysisReport")}
          </p>
        </div>

        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <ModernAnalyzeMenu />
          </div>
          <div className="space-y-6">
            <ModernAnalyzeResult />
          </div>
        </div>
      </div>
    </ContextProvider>
  );
}
