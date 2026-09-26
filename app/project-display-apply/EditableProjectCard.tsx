"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { Crop, Upload, Plus, X, Eye, Pencil } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PopoverClose } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import ProjectCard, {
  type CardField,
} from "@/app/components/showcase/ProjectCard";
import ImageCropDialog from "./ImageCropDialog";
import type { ShowcaseCardState } from "./types";

function usePreview(file: File | null) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    const next = file ? URL.createObjectURL(file) : "";
    setUrl(next);
    return () => {
      if (next) URL.revokeObjectURL(next);
    };
  }, [file]);
  return url;
}
export default function EditableProjectCard({
  state,
  onChange,
  disabled,
}: {
  state: ShowcaseCardState;
  onChange: (value: Partial<ShowcaseCardState>) => void;
  disabled: boolean;
}) {
  const t = useTranslations("ui");
  const cover = usePreview(state.coverFile);
  const avatar = usePreview(state.avatarFile);
  const coverInput = useRef<HTMLInputElement>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const [originals, setOriginals] = useState<
    Partial<Record<"cover" | "avatar", File>>
  >({});
  const [editing, setEditing] = useState<{
    file: File;
    kind: "cover" | "avatar";
  } | null>(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState(false);
  const platforms = [
    { value: "scratch", label: t("scratchCommunity") },
    { value: "40code", label: "40code" },
    { value: "ccw", label: t("ccw") },
    { value: "aerfaying", label: t("aerfaying") },
    { value: "github", label: "GitHub" },
    { value: "other", label: t("other") },
  ];
  function choose(file: File | undefined, kind: "cover" | "avatar") {
    if (!file) return;
    if (
      file.size > 20 * 1024 * 1024 ||
      !/^image\/(jpeg|png|webp)$/.test(file.type)
    ) {
      setError(t("imageInputRequirements"));
      return;
    }
    setError("");
    setEditing({ file, kind });
  }
  function editor(field: CardField) {
    if (field === "cover" || field === "avatar") {
      const file = field === "cover" ? state.coverFile : state.avatarFile;
      return (
        <div className="space-y-3">
          <p className="text-muted-foreground text-xs leading-6">
            {field === "cover"
              ? "4:3 · 1200 × 900 · PNG"
              : "1:1 · 256 × 256 · PNG"}
          </p>
          <PopoverClose asChild>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                (field === "cover" ? coverInput : avatarInput).current?.click()
              }
            >
              <Upload />
              {field === "cover"
                ? t("changeCover")
                : t("clickToChangeTheAvatar")}
            </Button>
          </PopoverClose>
          {file && (
            <PopoverClose asChild>
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() =>
                  setEditing({ kind: field, file: originals[field] ?? file })
                }
              >
                <Crop />
                {field === "cover" ? t("cropCover") : t("cropAvatar")}
              </Button>
            </PopoverClose>
          )}
        </div>
      );
    }
    if (field === "name")
      return (
        <Input
          aria-label={t("projectName")}
          value={state.projectName}
          placeholder={t("projectName2")}
          maxLength={80}
          onChange={(e) => onChange({ projectName: e.target.value })}
          onFocus={(e) => e.target.select()}
        />
      );
    if (field === "author")
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-author">{t("authorName")}</Label>
            <Input
              id="edit-author"
              value={state.authorName}
              maxLength={80}
              onChange={(e) => onChange({ authorName: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-author-url">{t("authorProfileUrl")}</Label>
            <Input
              id="edit-author-url"
              type="url"
              placeholder="https://"
              maxLength={2048}
              value={state.authorLink}
              onChange={(e) => onChange({ authorLink: e.target.value })}
            />
          </div>
        </div>
      );
    if (field === "brief")
      return (
        <Textarea
          aria-label={t("descriptionUpTo20Characters")}
          value={state.projectBrief}
          placeholder={t("brieflyDescribeYourProject")}
          rows={3}
          onChange={(e) =>
            onChange({
              projectBrief: Array.from(e.target.value).slice(0, 20).join(""),
            })
          }
        />
      );
    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-xs leading-6">
          {t("cardLinksHelp")}
        </p>
        {state.links.map((link) => (
          <div key={link.id} className="space-y-3 rounded-lg border p-3">
            <div className="flex items-center gap-2">
              <Select
                value={link.platform}
                onValueChange={(value) =>
                  onChange({
                    links: state.links.map((item) =>
                      item.id === link.id ? { ...item, platform: value } : item,
                    ),
                  })
                }
              >
                <SelectTrigger
                  aria-label={t("linkPlatform")}
                  className="min-w-0 flex-1"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon"
                aria-label={t("removeProjectLink")}
                onClick={() => {
                  const links = state.links.filter(
                    (item) => item.id !== link.id,
                  );
                  onChange({
                    links,
                    defaultLinkId:
                      state.defaultLinkId === link.id
                        ? (links[0]?.id ?? "")
                        : state.defaultLinkId,
                  });
                }}
              >
                <X />
              </Button>
            </div>
            <Input
              type="url"
              aria-label={t("projectLink")}
              placeholder="https://"
              maxLength={2048}
              value={link.url}
              onChange={(e) =>
                onChange({
                  links: state.links.map((item) =>
                    item.id === link.id
                      ? { ...item, url: e.target.value }
                      : item,
                  ),
                })
              }
            />
            <label className="flex cursor-pointer items-center gap-2 text-xs">
              <input
                type="radio"
                name="default-project-link"
                checked={state.defaultLinkId === link.id}
                onChange={() => onChange({ defaultLinkId: link.id })}
                className="accent-[hsl(var(--primary))]"
              />
              {t("defaultProjectLink")}
            </label>
          </div>
        ))}
        <Button
          variant="outline"
          className="w-full"
          disabled={state.links.length >= 10}
          onClick={() => {
            const id = crypto.randomUUID();
            onChange({
              links: [...state.links, { id, platform: "scratch", url: "" }],
              defaultLinkId: state.defaultLinkId || id,
            });
          }}
        >
          <Plus />
          {t("addAProjectLink")}
        </Button>
        <PopoverClose asChild>
          <Button className="w-full">{t("doneEditing")}</Button>
        </PopoverClose>
      </div>
    );
  }
  const safeUrl = (value: string) => {
    try {
      const u = new URL(value);
      return ["https:", "http:"].includes(u.protocol) &&
        !u.username &&
        !u.password
        ? u.href
        : "";
    } catch {
      return "";
    }
  };
  const project = {
    name: state.projectName,
    author: state.authorName,
    author_link: safeUrl(state.authorLink),
    project_link: safeUrl(
      state.links.find((item) => item.id === state.defaultLinkId)?.url ?? "",
    ),
    brief: state.projectBrief,
    cover_image_path: cover,
    avatar_image_path: avatar,
    links: state.links
      .filter((link) => safeUrl(link.url))
      .map((link) => ({
        platform: link.platform,
        url: safeUrl(link.url),
        is_default: link.id === state.defaultLinkId,
      })),
  };
  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold">{t("livePreview")}</h2>
        <Button
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => setPreview((value) => !value)}
        >
          {preview ? <Pencil /> : <Eye />}
          {preview ? t("editYourProjectCard") : t("previewPublishedCard")}
        </Button>
      </div>
      <div className="bg-muted/20 flex min-h-[430px] items-center justify-center rounded-2xl border px-5 py-10">
        <ProjectCard
          project={project}
          editor={preview ? undefined : editor}
          disabled={disabled}
        />
      </div>
      <p className="text-muted-foreground text-center text-xs leading-6">
        {preview ? t("publishedPreviewHelp") : t("interactivePreviewHelp")}
      </p>
      <p className="text-muted-foreground text-xs leading-6">
        {t("imageInputRequirements")}
      </p>
      {error && (
        <p role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
      <input
        ref={coverInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          choose(e.target.files?.[0], "cover");
          e.target.value = "";
        }}
      />
      <input
        ref={avatarInput}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => {
          choose(e.target.files?.[0], "avatar");
          e.target.value = "";
        }}
      />
      {editing && (
        <ImageCropDialog
          file={editing.file}
          kind={editing.kind}
          onClose={() => setEditing(null)}
          onSave={(file) => {
            onChange(
              editing.kind === "cover"
                ? { coverFile: file }
                : { avatarFile: file },
            );
            setOriginals((value) => ({
              ...value,
              [editing.kind]: editing.file,
            }));
            setEditing(null);
          }}
        />
      )}
    </section>
  );
}
