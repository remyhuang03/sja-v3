import { useTranslations } from "next-intl";
import { useState, useContext } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Settings, Download, Copy, FileText, Hash } from "lucide-react";
import { useRequestJSON } from "@/lib/api";
import { useAnalyze } from "./context";
import FileUploadZone from "./FileUploadZone";

export default function ModernAnalyzeMenu() {
  const t = useTranslations("ui");
  const requestJSON = useRequestJSON();

  const states = useAnalyze();
  const [files, setFiles] = useState<FileList | null>(null);
  const [sortOrder, setSortOrder] = useState("desc");
  const [rankCategory, setRankCategory] = useState("top12");
  const [enableClickableReport, setEnableClickableReport] = useState(false);

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    if (states.status === "analyzing") return;

    states.setStatus("analyzing");

    const formData = new FormData();
    if (files && files[0]) {
      formData.append("file", files[0]);
    } else {
      states.setErrorMsg(t("uploadAProjectFirst"));
      states.setStatus("analyze_error");
      return;
    }

    formData.append("is_sort", sortOrder);
    formData.append("is_high_rank_cate", rankCategory);

    requestJSON<{ status: string; token: string; msg?: string }>(
      "/api/v2/analyze",
      {
        method: "POST",
        body: formData,
      },
    )
      .then((data) => {
        if (data.status === "ok") {
          states.setReportUrl(new URL(data.token, window.location.origin).href);
          states.setStatus("analyzed");
        } else {
          states.setErrorMsg(data.msg || t("analysisFailed"));
          states.setStatus("analyze_error");
        }
      })
      .catch((error) => {
        states.setErrorMsg(error.message);
        states.setStatus("analyze_error");
      });
  }

  function handleMarkdownCopy() {
    const url = states.reportUrl;
    let md = "";
    if (enableClickableReport) {
      md = `[![](${url})](${url})`;
    } else {
      md = `[![](${url})](https://sja.remya.top)`;
    }

    navigator.clipboard.writeText(md).then(
      () => {
        alert(t("markdownCopiedPasteItIntoYourProjectDescription"));
      },
      () => {
        alert(t("couldNotCopyMarkdown"));
      },
    );
  }

  const isAnalyzing = states.status === "analyzing";
  const isAnalyzed = states.status === "analyzed";

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          {t("uploadAndSettings")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={submitHandler} className="space-y-6">
          {/* File upload */}
          <div className="space-y-2">
            <Label>{t("projectFile")}</Label>
            <FileUploadZone
              onFileChange={setFiles}
              currentFile={files?.[0] || null}
              accept=".sb3,.json,.cc3,application/json,application/octet-stream"
              maxSize={48}
            />
          </div>

          <Separator />

          {/* Sorting options */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label className="flex items-center gap-2 sm:min-w-[100px]">
              <Settings className="h-4 w-4" />
              {t("categoryOrder")}
            </Label>
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="sm:flex-1">
                <SelectValue placeholder={t("chooseAnOrder")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="desc">{t("descending")}</SelectItem>
                <SelectItem value="none">{t("default")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Category display */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <Label className="flex items-center gap-2 sm:min-w-[100px]">
              <Hash className="h-4 w-4" />
              {t("categoriesToDisplay")}
            </Label>
            <Select value={rankCategory} onValueChange={setRankCategory}>
              <SelectTrigger className="sm:flex-1">
                <SelectValue placeholder={t("chooseCategories")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="top12">{t("top12Categories")}</SelectItem>
                <SelectItem value="classic">
                  {t("classicCategories")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          {/* Analyze action */}
          <Button
            type="submit"
            className="w-full"
            disabled={isAnalyzing || !files}
            size="lg"
          >
            {isAnalyzing ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
                {t("analyzing")}
              </>
            ) : (
              <>
                <FileText className="mr-2 h-4 w-4" />
                {t("analyzeProject")}
              </>
            )}
          </Button>
        </form>

        {/* Report actions */}
        {isAnalyzed && (
          <>
            <Separator />
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="clickable-report"
                  checked={enableClickableReport}
                  onCheckedChange={(checked) =>
                    setEnableClickableReport(checked as boolean)
                  }
                />
                <Label htmlFor="clickable-report" className="text-sm">
                  {t("makeTheReportImageClickableToOpenTheFull")}
                </Label>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={handleMarkdownCopy}
                  className="flex-1"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {t("copyMarkdown")}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => window.open(states.reportUrl, "_blank")}
                  className="flex-1"
                >
                  <Download className="mr-2 h-4 w-4" />
                  {t("downloadReport")}
                </Button>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
