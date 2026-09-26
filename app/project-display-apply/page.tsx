"use client";

import { useTranslations } from "next-intl";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FileText,
  Upload,
  Plus,
  X,
  ExternalLink,
  User,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle,
} from "lucide-react";
import {
  ShowcaseCardState,
  ProjectLinkItem,
  buildSubmissionFormData,
  isSubmissionReady,
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

  const platformOptions = [
    { value: "scratch", label: t("scratchCommunity") },
    { value: "40code", label: "40code" },
    { value: "ccw", label: t("ccw") },
    { value: "aerfaying", label: t("aerfaying") },
    { value: "github", label: "GitHub" },
    { value: "other", label: t("other") },
  ];

  const [state, setState] = useState<ShowcaseCardState>(defaultState);
  const [submitting, setSubmitting] = useState(false);
  const [newLinkPlatform, setNewLinkPlatform] = useState("scratch");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const coverInputRef = useRef<HTMLInputElement>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  useEffect(() => {
    const url = state.coverFile ? URL.createObjectURL(state.coverFile) : null;
    setCoverPreviewUrl(url);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [state.coverFile]);
  useEffect(() => {
    const url = state.avatarFile ? URL.createObjectURL(state.avatarFile) : null;
    setAvatarPreviewUrl(url);
    return () => {
      if (url) URL.revokeObjectURL(url);
    };
  }, [state.avatarFile]);

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState({ ...state, coverFile: e.target.files[0] });
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setState({ ...state, avatarFile: e.target.files[0] });
    }
  };

  const addLink = () => {
    if (!newLinkUrl.trim()) return;
    const newLink: ProjectLinkItem = {
      id: Date.now().toString(),
      platform: newLinkPlatform,
      url: newLinkUrl.trim(),
    };
    const newLinks = [...state.links, newLink];
    setState({
      ...state,
      links: newLinks,
      defaultLinkId: newLinks.length === 1 ? newLink.id : state.defaultLinkId,
    });
    setNewLinkUrl("");
  };

  const removeLink = (id: string) => {
    const newLinks = state.links.filter((l) => l.id !== id);
    setState({
      ...state,
      links: newLinks,
      defaultLinkId:
        state.defaultLinkId === id
          ? newLinks[0]?.id || ""
          : state.defaultLinkId,
    });
  };

  const handleSubmit = async () => {
    if (submitting) return;
    const errors = getValidationErrors(state, t);
    if (errors.length > 0) {
      alert(
        t("pleaseCompleteTheseRequiredFields") +
          errors.map((e, i) => `${i + 1}. ${e}`).join("\n"),
      );
      return;
    }

    setSubmitting(true);
    try {
      const fd = buildSubmissionFormData(state);
      const res = await fetch("/api/v2/project-display-apply", {
        method: "POST",
        body: fd,
      });

      if (!res.ok) {
        // Read structured API errors.
        let errorMessage = t("submissionFailed");
        try {
          const errorData = await res.json();
          errorMessage = errorData.message || errorMessage;
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += ":\n" + errorData.errors.join("\n");
          }
        } catch {
          // Keep the localized fallback for non-JSON responses.
          // The response body has already been consumed.
        }
        alert(errorMessage);
      } else {
        const data = await res.json();
        alert(data.message || t("submittedSuccessfullyAwaitingReview"));
        // Clear the form.
        setState(defaultState);
        // Reset file inputs.
        if (coverInputRef.current) coverInputRef.current.value = "";
        if (avatarInputRef.current) avatarInputRef.current.value = "";
      }
    } catch (e) {
      console.error(t("submissionError"), e);
      alert(t("networkErrorCheckYourConnectionAndTryAgain"));
    } finally {
      setSubmitting(false);
    }
  };

  // Resolve the selected platform label.
  const getPlatformLabel = (platform: string) =>
    platformOptions.find((p) => p.value === platform)?.label || platform;

  return (
    <div className="bg-background min-h-screen">
      {/* Header */}
      <div className="bg-card/50 sticky top-0 z-10 border-b backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Badge variant="secondary">
              <FileText className="mr-2 h-4 w-4" />
              {t("showcaseSubmission")}
            </Badge>
            <h1 className="text-2xl font-bold">
              {t("submitToTheSjaShowcase")}
            </h1>
          </div>
          <p className="text-muted-foreground mt-1 text-sm">
            {t("completeTheFormToPreviewYourShowcaseCard")}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Submission form */}
          <div className="space-y-6">
            {/* Basic information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("basicInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">{t("projectName")}</Label>
                  <Input
                    id="projectName"
                    placeholder={t("enterAProjectName")}
                    value={state.projectName}
                    onChange={(e) =>
                      setState({ ...state, projectName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorName">{t("authorName")}</Label>
                  <Input
                    id="authorName"
                    placeholder={t("enterAnAuthorName")}
                    value={state.authorName}
                    onChange={(e) =>
                      setState({ ...state, authorName: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="authorLink">{t("authorProfileUrl")}</Label>
                  <Input
                    id="authorLink"
                    placeholder="https://..."
                    value={state.authorLink}
                    onChange={(e) =>
                      setState({ ...state, authorLink: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projectBrief">
                    {t("descriptionUpTo20Characters")}
                  </Label>
                  <Textarea
                    id="projectBrief"
                    placeholder={t("brieflyDescribeYourProject")}
                    value={state.projectBrief}
                    onChange={(e) =>
                      setState({
                        ...state,
                        projectBrief: e.target.value.slice(0, 20),
                      })
                    }
                    rows={2}
                    className="resize-none"
                  />
                  <p className="text-muted-foreground text-right text-xs">
                    {state.projectBrief.length}/20
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Project links */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <LinkIcon className="h-5 w-5" />
                  {t("projectLinks")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Add a link */}
                <div className="space-y-2">
                  <Label>{t("addAProjectLink")}</Label>
                  <div className="flex gap-2">
                    <Select
                      value={newLinkPlatform}
                      onValueChange={setNewLinkPlatform}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platformOptions.map((opt) => (
                          <SelectItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="https://..."
                      value={newLinkUrl}
                      onChange={(e) => setNewLinkUrl(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && addLink()}
                      className="flex-1"
                    />
                    <Button onClick={addLink} size="icon" variant="outline">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Link list */}
                {state.links.length > 0 && (
                  <div className="space-y-2">
                    <Label>{t("addedLinks")}</Label>
                    <div className="space-y-2">
                      {state.links.map((link) => (
                        <div
                          key={link.id}
                          className="bg-muted/30 flex items-center gap-2 rounded-lg border p-3"
                        >
                          <div className="min-w-0 flex-1">
                            <div className="mb-1 flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {getPlatformLabel(link.platform)}
                              </Badge>
                              {link.id === state.defaultLinkId && (
                                <Badge variant="default" className="text-xs">
                                  {t("default")}
                                </Badge>
                              )}
                            </div>
                            <p className="text-muted-foreground truncate text-xs">
                              {link.url}
                            </p>
                          </div>
                          <div className="flex gap-1">
                            {link.id !== state.defaultLinkId && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() =>
                                  setState({ ...state, defaultLinkId: link.id })
                                }
                              >
                                {t("setAsDefault")}
                              </Button>
                            )}
                            <Button
                              size="icon"
                              variant="ghost"
                              onClick={() => removeLink(link.id)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Image uploads */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  {t("images")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cover image */}
                <div className="space-y-2">
                  <Label>{t("coverImage43")}</Label>
                  <div
                    className="hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors"
                    onClick={() => coverInputRef.current?.click()}
                  >
                    {coverPreviewUrl ? (
                      <div className="relative aspect-[4/3] overflow-hidden rounded">
                        <Image
                          src={coverPreviewUrl}
                          alt={t("coverPreview")}
                          fill
                          className="object-cover"
                        />
                      </div>
                    ) : (
                      <div className="text-muted-foreground flex aspect-[4/3] flex-col items-center justify-center">
                        <Upload className="mb-2 h-8 w-8" />
                        <p className="text-sm">
                          {t("clickToUploadACoverImage")}
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={coverInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleCoverChange}
                    className="hidden"
                  />
                </div>

                {/* Avatar image */}
                <div className="space-y-2">
                  <Label>{t("authorAvatar11")}</Label>
                  <div
                    className="hover:border-primary/50 cursor-pointer rounded-lg border-2 border-dashed p-4 transition-colors"
                    onClick={() => avatarInputRef.current?.click()}
                  >
                    {avatarPreviewUrl ? (
                      <div className="flex items-center gap-4">
                        <div className="relative h-20 w-20 overflow-hidden rounded-full">
                          <Image
                            src={avatarPreviewUrl}
                            alt={t("avatarPreview")}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {t("clickToChangeTheAvatar")}
                        </p>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="bg-muted flex h-20 w-20 items-center justify-center rounded-full">
                          <Upload className="text-muted-foreground h-8 w-8" />
                        </div>
                        <p className="text-muted-foreground text-sm">
                          {t("clickToUploadAnAvatar")}
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </CardContent>
            </Card>

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

          {/* Live preview */}
          <div className="h-fit lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <CardTitle className="text-lg">{t("livePreview")}</CardTitle>
                <p className="text-muted-foreground text-sm">
                  {t("howYourProjectWillAppearInTheShowcase")}
                </p>
              </CardHeader>
              <CardContent className="p-6">
                {/* Match the published showcase card. */}
                <div className="group border-border/60 hover:shadow-primary/20 ring-border/40 hover:ring-primary/50 mx-auto w-56 overflow-hidden rounded-2xl border bg-[hsl(var(--card)_/_85%)] shadow-md ring-1 transition-colors duration-500 hover:bg-[hsl(var(--card)_/_95%)]">
                  {/* Author and Project Info */}
                  <div className="flex items-center gap-3 p-3 pb-2">
                    <div className="flex-shrink-0">
                      {avatarPreviewUrl ? (
                        <Image
                          width={36}
                          height={36}
                          src={avatarPreviewUrl}
                          className="ring-primary/30 h-9 w-9 rounded-full object-cover ring-2"
                          alt={state.authorName || t("author")}
                        />
                      ) : (
                        <div className="ring-primary/30 bg-muted flex h-9 w-9 items-center justify-center rounded-full ring-2">
                          <User className="text-muted-foreground h-4 w-4" />
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="group-hover:text-primary line-clamp-1 text-sm font-semibold tracking-wide text-white">
                        {state.projectName || t("projectName2")}
                      </h3>
                      <p className="text-muted-foreground hover:text-primary/80 truncate text-xs leading-tight">
                        {state.authorName || t("authorName2")}
                      </p>
                    </div>
                  </div>

                  {/* Project Poster */}
                  <div className="bg-muted relative aspect-[4/3] overflow-hidden">
                    {coverPreviewUrl ? (
                      <Image
                        width={224}
                        height={168}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.05] group-hover:rotate-[0.3deg]"
                        src={coverPreviewUrl}
                        alt={state.projectName || t("cover")}
                      />
                    ) : (
                      <div className="text-muted-foreground flex h-full w-full items-center justify-center">
                        <div className="text-center">
                          <ImageIcon className="mx-auto mb-2 h-12 w-12 opacity-50" />
                          <p className="text-sm">
                            {t("waitingForACoverImage")}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="from-background/40 via-background/5 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  </div>

                  {/* Brief */}
                  <div className="p-3 pt-2">
                    <p className="text-muted-foreground line-clamp-2 min-h-[2.9rem] text-[12px] leading-relaxed">
                      {state.projectBrief || t("noDescription")}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
