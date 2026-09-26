"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import EditableProjectCard from "./EditableProjectCard";
import { useRequestJSON } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle } from "lucide-react";
import {
  ShowcaseCardState,
  buildSubmissionFormData,
  getValidationErrors,
} from "./types";

const defaultState: ShowcaseCardState = {
  projectName: "",
  authorName: "",
  authorLink: "",
  projectBrief: "",
  links: [],
  defaultLinkId: "",
  coverFile: null,
  avatarFile: null,
  agreedNotice: false,
  confirmedAuthor: false,
  confirmedContent: false,
};

export default function ProjectDisplayApplyPage() {
  const t = useTranslations("ui");
  const request = useRequestJSON();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [editorKey, setEditorKey] = useState(0);

  const [state, setState] = useState<ShowcaseCardState>(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const handleSubmit = async () => {
    if (submitting) return;
    const errors = getValidationErrors(state, t);
    if (errors.length) {
      setError(errors.join(" · "));
      return;
    }
    setSubmitting(true);
    setError("");
    setSuccess(false);
    try {
      await request("/api/v2/project-display-apply", {
        method: "POST",
        body: buildSubmissionFormData(state),
      });
      setState(defaultState);
      setEditorKey((key) => key + 1);
      setSuccess(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : t("submissionFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
        <h1 className="text-3xl font-semibold">
          {t("submitToTheSjaShowcase")}
        </h1>
        <p className="text-muted-foreground mt-3">
          {t("interactivePreviewHelp")}
        </p>
        {success && (
          <p
            role="status"
            className="border-primary/30 bg-primary/5 mt-6 rounded-lg border p-4"
          >
            {t("submittedSuccessfullyAwaitingReview")}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="border-destructive/40 text-destructive mt-6 rounded-lg border p-4 text-sm"
          >
            {error}
          </p>
        )}
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-2">
          <div className="lg:sticky lg:top-28">
            <EditableProjectCard
              key={editorKey}
              state={state}
              disabled={submitting}
              onChange={(value) =>
                setState((previous) => ({ ...previous, ...value }))
              }
            />
          </div>
          <div className="space-y-6">
            {/* Submission requirements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  {t("submissionRequirements")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-muted-foreground space-y-2 text-sm">
                  <p>{t("includeAnSjaReportInYourProjectDescriptionBefore")}</p>
                  <p>{t("sjaSelectsProjectsForQuality")}</p>
                  <p>{t("duplicateSubmissionsWillBeRejected")}</p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="agreedNotice"
                      checked={state.agreedNotice}
                      onCheckedChange={(checked) =>
                        setState({ ...state, agreedNotice: !!checked })
                      }
                    />
                    <Label
                      htmlFor="agreedNotice"
                      className="cursor-pointer text-sm"
                    >
                      {t("iHaveReadAndAgreeToTheSubmissionRequirements")}
                    </Label>
                  </div>

                  <div className="flex items-start gap-2">
                    <Checkbox
                      id="confirmedAuthor"
                      checked={state.confirmedAuthor}
                      onCheckedChange={(checked) =>
                        setState({ ...state, confirmedAuthor: !!checked })
                      }
                    />
                    <Label
                      htmlFor="confirmedAuthor"
                      className="cursor-pointer text-sm"
                    >
                      {t("iConfirmThatThisIsMyOriginalWorkAnd")}
                    </Label>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Checkbox
                    id="confirmedContent"
                    checked={state.confirmedContent}
                    onCheckedChange={(checked) =>
                      setState({ ...state, confirmedContent: !!checked })
                    }
                  />
                  <Label htmlFor="confirmedContent">
                    {t("iConfirmThatTheProjectMeetsTheShowcaseRequirements")}
                  </Label>
                </div>

                <Button
                  className="w-full"
                  size="lg"
                  disabled={submitting}
                  onClick={handleSubmit}
                >
                  {submitting ? t("submitting") : t("submitApplication")}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
