import { useTranslations } from "next-intl";
import { useContext } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertCircle, Loader2, FileImage } from "lucide-react";
import { useAnalyze } from "./context";
import { cn } from "@/lib/utils";

export default function ModernAnalyzeResult() {
  const t = useTranslations("ui");

  const states = useAnalyze();
  const status = states.status;
  const reportUrl = states.reportUrl;
  const errorMsg = states.errorMsg;

  const getStatusIcon = () => {
    switch (status) {
      case "analyzing":
        return <Loader2 className="text-primary h-5 w-5 animate-spin" />;
      case "analyzed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "analyze_error":
        return <AlertCircle className="text-destructive h-5 w-5" />;
      default:
        return <FileImage className="text-muted-foreground h-5 w-5" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "analyzing":
        return t("analyzing2");
      case "analyzed":
        return t("analysisComplete");
      case "analyze_error":
        return t("analysisError");
      default:
        return t("ready");
    }
  };

  const getStatusVariant = () => {
    switch (status) {
      case "analyzing":
        return "default";
      case "analyzed":
        return "default";
      case "analyze_error":
        return "destructive";
      default:
        return "secondary";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            {getStatusIcon()}
            {t("analysisResults")}
          </span>
          <Badge variant={getStatusVariant()}>{getStatusText()}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {status === "init" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <FileImage className="text-muted-foreground mb-4 h-16 w-16" />
            <h3 className="text-muted-foreground mb-2 text-lg font-medium">
              {t("uploadAProjectToGenerateAReport")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("chooseAProjectFileAndSelectAnalyzeProject")}
            </p>
          </div>
        )}

        {status === "analyzing" && (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Loader2 className="text-primary mb-4 h-16 w-16 animate-spin" />
            <h3 className="text-foreground mb-2 text-lg font-medium">
              {t("analyzingYourProject")}
            </h3>
            <p className="text-muted-foreground text-sm">
              {t("pleaseWaitWhileWeProcessYourProjectFile")}
            </p>
          </div>
        )}

        {status === "analyze_error" && errorMsg && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{errorMsg}</AlertDescription>
          </Alert>
        )}

        {status === "analyzed" && reportUrl && (
          <div className="space-y-4">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                {t("yourReportIsReadyViewItBelowOrUse")}
              </AlertDescription>
            </Alert>

            <div className="bg-card overflow-hidden rounded-lg border">
              <Image
                unoptimized
                src={reportUrl}
                alt={t("analysisReport")}
                width={800}
                height={600}
                className="h-auto w-full"
                style={{ maxHeight: "600px", objectFit: "contain" }}
              />
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
