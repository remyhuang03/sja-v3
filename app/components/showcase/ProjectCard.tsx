"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import {
  User,
  ImageIcon,
  Link2,
  ArrowUpRight,
  Check,
  Pencil,
  X,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  PopoverClose,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type ProjectCardData = {
  id?: string | number;
  name: string;
  author: string;
  author_link: string;
  project_link: string;
  brief: string;
  cover_image_path: string;
  avatar_image_path: string;
  links?: { platform: string; url: string; is_default?: boolean }[];
};
export type CardField =
  "name" | "author" | "avatar" | "cover" | "brief" | "links";
export type CardEditor = (field: CardField) => ReactNode;

function CardImage({ src, avatar = false }: { src: string; avatar?: boolean }) {
  const [failed, setFailed] = useState(false);
  return src && !failed ? (
    <Image
      src={src}
      alt=""
      fill
      unoptimized={src.startsWith("blob:")}
      sizes={avatar ? "36px" : "224px"}
      className="object-cover"
      onError={() => setFailed(true)}
    />
  ) : avatar ? (
    <User className="text-muted-foreground h-4 w-4" />
  ) : (
    <ImageIcon className="text-muted-foreground/60 h-9 w-9" strokeWidth={1.5} />
  );
}
function CardArea({
  field,
  label,
  editor,
  children,
  className,
  href,
  disabled,
}: {
  field: CardField;
  label: string;
  editor?: CardEditor;
  children: ReactNode;
  className?: string;
  href?: string;
  disabled?: boolean;
}) {
  const t = useTranslations("ui");
  if (editor)
    return (
      <Popover>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            aria-label={label}
            className={cn(
              "group/edit hover:bg-primary/10 focus-visible:ring-primary relative cursor-pointer text-left transition-colors outline-none focus-visible:ring-2 focus-visible:ring-inset",
              className,
            )}
          >
            {children}
            <span
              aria-hidden="true"
              className="bg-background/90 text-primary absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded opacity-0 shadow-sm group-hover/edit:opacity-100 group-focus-visible/edit:opacity-100"
            >
              <Pencil className="h-3 w-3" />
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent
          side="right"
          align="start"
          aria-label={label}
          className={cn("relative", field === "links" && "w-96")}
        >
          <div className="mb-4 flex items-center justify-between gap-3 pr-7">
            <h3 className="text-sm font-medium">{label}</h3>
          </div>
          {editor(field)}
          <PopoverClose
            aria-label={t("closeEditor")}
            className="hover:bg-muted focus-visible:outline-ring absolute top-3 right-3 rounded p-1 focus-visible:outline-2"
          >
            <X className="h-4 w-4" />
          </PopoverClose>
        </PopoverContent>
      </Popover>
    );
  if (href)
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "hover:text-primary focus-visible:ring-ring outline-none focus-visible:ring-2",
          className,
        )}
      >
        {children}
      </a>
    );
  return <div className={className}>{children}</div>;
}

/** The published card and editable preview share this exact layout. */
export default function ProjectCard({
  project,
  editor,
  disabled,
}: {
  project: ProjectCardData;
  editor?: CardEditor;
  disabled?: boolean;
}) {
  const t = useTranslations("ui");
  const common = { editor, disabled };
  const platformLabels: Record<string, string> = {
    scratch: t("scratchCommunity"),
    ccw: t("ccw"),
    aerfaying: t("aerfaying"),
    github: "GitHub",
    other: t("other"),
  };
  const links = project.links?.length
    ? project.links
    : project.project_link
      ? [
          {
            platform: t("projectLink"),
            url: project.project_link,
            is_default: true,
          },
        ]
      : [];
  return (
    <article className="border-border/70 bg-card text-card-foreground w-56 shrink-0 snap-start overflow-hidden rounded-2xl border shadow-sm">
      <div className="flex items-center gap-3 p-3 pb-2">
        <CardArea
          {...common}
          field="avatar"
          label={t("authorAvatar11")}
          href={project.author_link}
          className="bg-muted ring-primary/25 relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full ring-2"
        >
          <CardImage
            key={project.avatar_image_path}
            src={project.avatar_image_path}
            avatar
          />
        </CardArea>
        <div className="min-w-0 flex-1">
          <CardArea
            {...common}
            field="name"
            label={t("projectName")}
            href={project.project_link}
            className="block w-full rounded-sm"
          >
            <h3 className="line-clamp-1 text-sm font-semibold tracking-wide">
              {project.name || t("projectName2")}
            </h3>
          </CardArea>
          <CardArea
            {...common}
            field="author"
            label={t("authorName")}
            href={project.author_link}
            className="mt-0.5 block w-full rounded-sm"
          >
            <p className="text-muted-foreground truncate text-xs leading-tight">
              {project.author || t("authorName2")}
            </p>
          </CardArea>
        </div>
      </div>
      <CardArea
        {...common}
        field="cover"
        label={t("coverImage43")}
        href={project.project_link}
        className="bg-muted relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden"
      >
        <CardImage
          key={project.cover_image_path}
          src={project.cover_image_path}
        />
      </CardArea>
      <CardArea
        {...common}
        field="brief"
        label={t("descriptionUpTo20Characters")}
        className="block min-h-[4rem] w-full px-3 pt-2 pb-3"
      >
        <p className="text-muted-foreground line-clamp-2 text-xs leading-relaxed">
          {project.brief || t("noDescription")}
        </p>
      </CardArea>
      <div className="border-border/60 border-t">
        {editor ? (
          <CardArea
            {...common}
            field="links"
            label={t("cardProjectLinks")}
            className="text-muted-foreground flex w-full items-center gap-2 px-3 py-2.5 text-xs"
          >
            <Link2 className="h-3.5 w-3.5" />
            {t("cardProjectLinks")}
            <ArrowUpRight className="ml-auto h-3 w-3" />
          </CardArea>
        ) : (
          <Popover>
            <PopoverTrigger
              disabled={!links.length}
              className="text-muted-foreground hover:bg-muted/50 focus-visible:outline-ring flex w-full items-center gap-2 px-3 py-2.5 text-xs focus-visible:outline-2"
            >
              <Link2 className="h-3.5 w-3.5" />
              {t("cardProjectLinks")}
              <ArrowUpRight className="ml-auto h-3 w-3" />
            </PopoverTrigger>
            <PopoverContent align="start" aria-label={t("cardProjectLinks")}>
              <h3 className="mb-3 text-sm font-medium">
                {t("cardProjectLinks")}
              </h3>
              <div className="space-y-1">
                {links.map((link, index) => (
                  <a
                    key={`${link.url}-${index}`}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:bg-muted focus-visible:outline-ring flex items-center gap-3 rounded-lg p-2 text-sm focus-visible:outline-2"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {platformLabels[link.platform] ||
                          link.platform ||
                          t("projectLink")}
                      </p>
                      <p className="text-muted-foreground truncate text-xs">
                        {link.url}
                      </p>
                    </div>
                    {link.is_default ? (
                      <Check
                        className="text-primary h-4 w-4"
                        aria-label={t("default")}
                      />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" />
                    )}
                  </a>
                ))}
              </div>
            </PopoverContent>
          </Popover>
        )}
      </div>
    </article>
  );
}
