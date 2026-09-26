"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useRequestJSON } from "@/lib/api";

type Report = {
  total_block_count: number;
  sprite_count: number;
  total_paragraph_count: number;
};
type Comparison = {
  similarity: number;
  opcode_similarity: number;
  structure_similarity: number;
  left: Report;
  right: Report;
};

export default function ComparePage() {
  const t = useTranslations("ui");
  const requestJSON = useRequestJSON();

  const [original, setOriginal] = useState<File | null>(null);
  const [compared, setCompared] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Comparison | null>(null);
  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!original || !compared || busy) return;
    setError("");
    setResult(null);
    if ([original, compared].some((file) => file.size > 48 * 1024 * 1024)) {
      setError(t("eachFileMustBe48MibOrSmaller"));
      return;
    }
    setBusy(true);
    try {
      const body = new FormData();
      body.append("original", original);
      body.append("compared", compared);
      const response = await requestJSON<{ data: Comparison }>(
        "/api/v2/compare",
        { method: "POST", body },
      );
      setResult(response.data);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("comparisonFailed"));
    } finally {
      setBusy(false);
    }
  }
  const percent = (value: number) => `${(value * 100).toFixed(1)}%`;
  return (
    <div className="mx-auto max-w-4xl space-y-6 px-4 py-10">
      <div>
        <h1 className="text-3xl font-bold">{t("projectSimilarity")}</h1>
        <p className="text-muted-foreground mt-3">
          {t("compareBlockTypesAndConnectionsInTwoScratchProjects")}
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>{t("chooseTwoProjects")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={submit} className="space-y-5">
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="original">{t("originalProject")}</Label>
                <Input
                  id="original"
                  type="file"
                  accept=".sb3,.cc3,.json"
                  required
                  disabled={busy}
                  onChange={(e) => setOriginal(e.target.files?.[0] ?? null)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compared">{t("comparisonProject")}</Label>
                <Input
                  id="compared"
                  type="file"
                  accept=".sb3,.cc3,.json"
                  required
                  disabled={busy}
                  onChange={(e) => setCompared(e.target.files?.[0] ?? null)}
                />
              </div>
            </div>
            <Button disabled={busy || !original || !compared}>
              {busy ? t("comparing") : t("compareProjects")}
            </Button>
          </form>
        </CardContent>
      </Card>
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {result && (
        <Card aria-live="polite">
          <CardHeader>
            <CardTitle>
              {t("overallSimilarity")}
              {percent(result.similarity)}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              {t("blockTypes")}
              {percent(result.opcode_similarity)} {t("connections")}
              {percent(result.structure_similarity)}
            </p>
            <table className="w-full text-left text-sm">
              <thead>
                <tr>
                  <th className="py-2">{t("metric")}</th>
                  <th>{t("originalProject")}</th>
                  <th>{t("comparisonProject")}</th>
                </tr>
              </thead>
              <tbody>
                {(
                  [
                    ["total_block_count", t("blocks")],
                    ["total_paragraph_count", t("scripts")],
                    ["sprite_count", t("sprites")],
                  ] as const
                ).map(([key, label]) => (
                  <tr key={key} className="border-t">
                    <th className="py-3">{label}</th>
                    <td>{result.left[key]}</td>
                    <td>{result.right[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="text-muted-foreground text-sm">
              {t("usesMultisetDiceCoefficientsForBlockTypesAndAdjacent")}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
