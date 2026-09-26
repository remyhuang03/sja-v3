"use client";
import { useCallback, useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRequestJSON } from "@/lib/api";
import type { WebsiteSubmission } from "@/lib/websites";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

export default function WebsiteReviewPanel({ token }: { token: string }) {
  const t = useTranslations("ui");
  const content = useTranslations("content");
  const locale = useLocale();
  const request = useRequestJSON();
  const [items, setItems] = useState<WebsiteSubmission[]>([]);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  const load = useCallback(
    async (target: number) => {
      setBusy(true);
      setError("");
      try {
        setItems(
          await request<WebsiteSubmission[]>(
            `/api/v2/website-review?limit=20&offset=${target * 20}`,
            { headers: { Authorization: `Bearer ${token}` } },
          ),
        );
        setPage(target);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("loadingFailed"));
      } finally {
        setBusy(false);
      }
    },
    [request, token, t],
  );
  useEffect(() => {
    void load(0);
  }, [load]);
  async function review(id: string, status: "approved" | "rejected") {
    setBusy(true);
    setError("");
    try {
      await request("/api/v2/website-review", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status, notes: notes[id] || "" }),
      });
      await load(page);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("reviewFailed"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="space-y-5">
      {error && (
        <p role="alert" className="text-destructive">
          {error}
        </p>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          disabled={busy || page === 0}
          onClick={() => load(page - 1)}
        >
          {t("previous")}
        </Button>
        <span>{t("pageNumber", { page: page + 1 })}</span>
        <Button
          variant="outline"
          disabled={busy || items.length < 20}
          onClick={() => load(page + 1)}
        >
          {t("next")}
        </Button>
        <Button variant="ghost" disabled={busy} onClick={() => load(page)}>
          {t("refresh")}
        </Button>
      </div>
      {!busy && !items.length && (
        <p className="text-muted-foreground">{t("noApplicationsYet")}</p>
      )}
      {items.map((item) => (
        <article
          key={item.id}
          className="bg-card space-y-4 rounded-xl border p-6"
        >
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-lg">{item.name}</h2>
            <Badge variant="outline">
              {
                {
                  pending: t("pending"),
                  approved: t("approved"),
                  rejected: t("rejected"),
                }[item.status]
              }
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">
            {content(`category_${item.category}`)} ·{" "}
            {new Date(item.created_at).toLocaleString(locale)}
          </p>
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary block break-all underline"
          >
            {item.url}
          </a>
          <p className="text-sm">{item.description}</p>
          {item.status === "pending" ? (
            <div className="space-y-3">
              <Label htmlFor={`website-notes-${item.id}`}>
                {t("reviewNotesRequiredWhenRejecting")}
              </Label>
              <Textarea
                id={`website-notes-${item.id}`}
                maxLength={2000}
                value={notes[item.id] || ""}
                onChange={(e) =>
                  setNotes((value) => ({ ...value, [item.id]: e.target.value }))
                }
              />
              <div className="flex gap-3">
                <Button
                  disabled={busy}
                  onClick={() => review(item.id, "approved")}
                >
                  {t("approveAndPublish")}
                </Button>
                <Button
                  variant="destructive"
                  disabled={busy || !notes[item.id]?.trim()}
                  onClick={() => review(item.id, "rejected")}
                >
                  {t("reject")}
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              {item.reviewer_notes || t("noReviewNotes")}
            </p>
          )}
        </article>
      ))}
    </div>
  );
}
