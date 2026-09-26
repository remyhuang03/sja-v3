"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRequestJSON } from "@/lib/api";
import categories from "@/data/nav/cates.json";

export default function WebsiteSubmissionPage() {
  const t = useTranslations("ui");
  const content = useTranslations("content");
  const request = useRequestJSON();
  const [category, setCategory] = useState("communities");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <Link
        href="/nav"
        className="text-muted-foreground hover:text-primary mb-8 inline-flex items-center gap-2 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("resources")}
      </Link>
      <h1 className="text-3xl font-semibold">{t("suggestAWebsite")}</h1>
      <p className="text-muted-foreground mt-4 text-sm leading-7">
        {t("websiteSubmissionIntro")}
      </p>
      {success ? (
        <div role="status" className="mt-8 space-y-5 rounded-xl border p-6">
          <CheckCircle2 className="text-primary" />
          <p>{t("websiteSubmitted")}</p>
          <Button
            variant="outline"
            onClick={() => {
              setSuccess(false);
              setConsent(false);
            }}
          >
            {t("submitAnotherWebsite")}
          </Button>
        </div>
      ) : (
        <form
          className="mt-8 space-y-6"
          onSubmit={async (event) => {
            event.preventDefault();
            if (busy) return;
            const form = new FormData(event.currentTarget);
            setBusy(true);
            setError("");
            try {
              await request("/api/v2/website-apply", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: form.get("name"),
                  url: form.get("url"),
                  description: form.get("description"),
                  category,
                  consent,
                }),
              });
              setSuccess(true);
            } catch (e) {
              setError(e instanceof Error ? e.message : t("submissionFailed"));
            } finally {
              setBusy(false);
            }
          }}
        >
          <fieldset disabled={busy} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="website-name">{t("websiteName")}</Label>
              <Input
                id="website-name"
                name="name"
                required
                maxLength={80}
                autoComplete="off"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-url">{t("websiteUrl")}</Label>
              <Input
                id="website-url"
                name="url"
                type="url"
                required
                maxLength={2048}
                placeholder="https://"
              />
              <p className="text-muted-foreground text-xs">
                {t("websiteIconAutomatic")}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-category">{t("websiteCategory")}</Label>
              <Select
                value={category}
                onValueChange={setCategory}
                disabled={busy}
              >
                <SelectTrigger id="website-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(categories).map((key) => (
                    <SelectItem key={key} value={key}>
                      {content(`category_${key}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website-description">
                {t("websiteDescription")}
              </Label>
              <Textarea
                id="website-description"
                name="description"
                maxLength={300}
                rows={3}
              />
            </div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="website-consent"
                checked={consent}
                disabled={busy}
                onCheckedChange={(value) => setConsent(value === true)}
              />
              <Label htmlFor="website-consent" className="text-sm leading-6">
                {t("websiteConsent")}
              </Label>
            </div>
          </fieldset>
          {error && (
            <p role="alert" className="text-destructive text-sm">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy || !consent}>
            {busy ? t("submitting") : t("submitApplication")}
          </Button>
        </form>
      )}
    </div>
  );
}
