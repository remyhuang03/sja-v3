"use client";

import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useRequestJSON } from "@/lib/api";
import Image from "next/image";

type Application = {
  id: string;
  project_name: string;
  author_name: string;
  author_link: string;
  brief: string;
  links: { url: string; platform: string; is_default: boolean }[];
  cover_image_path: string;
  avatar_image_path: string;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  reviewer_notes: string;
};

export default function ReviewPage() {
  const t = useTranslations("ui");
  const requestJSON = useRequestJSON();
  const locale = useLocale();

  // The credential stays in memory and is cleared on refresh/logout.
  const [token, setToken] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [items, setItems] = useState<Application[]>([]);
  const [page, setPage] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notes, setNotes] = useState<Record<string, string>>({});
  async function load(target = page) {
    setBusy(true);
    setError("");
    try {
      const rows = await requestJSON<Application[]>(
        `/api/v2/project-display-review?limit=20&offset=${target * 20}`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      setItems(rows);
      setPage(target);
      setAuthenticated(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("loadingFailed"));
    } finally {
      setBusy(false);
    }
  }
  async function review(id: string, status: "approved" | "rejected") {
    setBusy(true);
    setError("");
    try {
      await requestJSON("/api/v2/project-display-review", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status, notes: notes[id] || "" }),
      });
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : t("reviewFailed"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="mx-auto max-w-5xl space-y-6 px-4 py-10">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">{t("showcaseReview")}</h1>
        {authenticated && (
          <Button
            variant="outline"
            onClick={() => {
              setToken("");
              setAuthenticated(false);
              setItems([]);
            }}
          >
            {t("signOut")}
          </Button>
        )}
      </div>
      {error && (
        <Alert variant="destructive" role="alert">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {!authenticated ? (
        <Card>
          <CardHeader>
            <CardTitle>{t("administratorVerification")}</CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                void load(0);
              }}
            >
              <Label htmlFor="admin-token">{t("reviewAccessKey")}</Label>
              <Input
                id="admin-token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                autoComplete="off"
                required
              />
              <Button disabled={busy}>
                {busy ? t("verifying") : t("openReviewDashboard")}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex items-center gap-3">
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
            <Button variant="ghost" disabled={busy} onClick={() => load()}>
              {t("refresh")}
            </Button>
          </div>
          {items.length === 0 && (
            <p className="text-muted-foreground">{t("noApplicationsYet")}</p>
          )}
          {items.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex justify-between gap-4">
                  <span>{item.project_name}</span>
                  <Badge
                    variant={
                      item.status === "pending" ? "secondary" : "outline"
                    }
                  >
                    {
                      {
                        pending: t("pending"),
                        approved: t("approved"),
                        rejected: t("rejected"),
                      }[item.status]
                    }
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col gap-5 sm:flex-row">
                  <Image
                    src={item.cover_image_path}
                    width={240}
                    height={180}
                    alt={t("coverForV0", { v0: item.project_name })}
                    className="rounded-md object-contain"
                  />
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Image
                        src={item.avatar_image_path}
                        width={32}
                        height={32}
                        alt={t("authorAvatar")}
                        className="rounded-full"
                      />
                      <a
                        href={item.author_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline"
                      >
                        {item.author_name}
                      </a>
                    </div>
                    <p>{item.brief}</p>
                    <p className="text-muted-foreground text-sm">
                      {new Date(item.created_at).toLocaleString(locale)}
                    </p>
                    {item.links.map((link, i) => (
                      <a
                        className="block text-sm break-all underline"
                        key={i}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.platform || t("projectLink")}
                        {link.is_default ? t("default2") : ""}：{link.url}
                      </a>
                    ))}
                  </div>
                </div>
                {item.status === "pending" ? (
                  <div className="space-y-3">
                    <Label htmlFor={`notes-${item.id}`}>
                      {t("reviewNotesRequiredWhenRejecting")}
                    </Label>
                    <Textarea
                      id={`notes-${item.id}`}
                      maxLength={2000}
                      value={notes[item.id] || ""}
                      onChange={(e) =>
                        setNotes((previous) => ({
                          ...previous,
                          [item.id]: e.target.value,
                        }))
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
              </CardContent>
            </Card>
          ))}
        </>
      )}
    </div>
  );
}
