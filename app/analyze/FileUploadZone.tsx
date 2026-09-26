"use client";

import { useTranslations } from "next-intl";
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, X, CheckCircle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadZoneProps {
  onFileChange: (files: FileList | null) => void;
  currentFile: File | null;
  accept?: string;
  maxSize?: number; // MB
  className?: string;
}

export default function FileUploadZone({
  onFileChange,
  currentFile,
  accept = ".sb3,.json,.cc3,application/json,application/octet-stream",
  maxSize = 48,
  className,
}: FileUploadZoneProps) {
  const t = useTranslations("ui");

  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFormats = accept
    .split(",")
    .map((format) => format.trim().replace(".", ""));

  const validateFile = (file: File): boolean => {
    setError(null);

    // Validate file size.
    if (file.size > maxSize * 1024 * 1024) {
      setError(t("theFileMustNotExceedV0Mib", { v0: maxSize }));
      return false;
    }

    // Validate the file extension.
    const fileExtension = file.name.split(".").pop()?.toLowerCase();
    if (
      !fileExtension ||
      !acceptedFormats.some(
        (format) =>
          format.toLowerCase().includes(fileExtension) ||
          fileExtension === format.toLowerCase(),
      )
    ) {
      setError(
        t("unsupportedFileTypeAcceptedFormatsV0", {
          v0: acceptedFormats.join(", "),
        }),
      );
      return false;
    }

    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];
    if (validateFile(file)) {
      onFileChange(files);
    } else {
      onFileChange(null);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeFile = () => {
    setError(null);
    onFileChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className={cn("space-y-4", className)}>
      <Card>
        <CardContent className="p-0">
          <div
            className={cn(
              "relative cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-all duration-200",
              "flex min-h-[200px] flex-col items-center justify-center",
              dragActive
                ? "border-primary bg-primary/5 scale-105"
                : "border-muted-foreground/25 hover:border-primary hover:bg-muted/20",
              error ? "border-destructive bg-destructive/5" : "",
              currentFile ? "border-primary bg-primary/5" : "",
            )}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            role="button"
            tabIndex={0}
            aria-label={t("chooseAScratchProjectFile")}
            onKeyDown={(e) => {
              if (
                e.target === e.currentTarget &&
                (e.key === "Enter" || e.key === " ")
              ) {
                e.preventDefault();
                openFileDialog();
              }
            }}
            onClick={openFileDialog}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleInputChange}
              className="hidden"
            />

            {currentFile ? (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-center">
                  <CheckCircle className="text-primary h-12 w-12" />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <FileText className="text-primary h-5 w-5" />
                    <span className="text-foreground font-medium">
                      {currentFile.name}
                    </span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {formatFileSize(currentFile.size)}
                  </Badge>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile();
                  }}
                  className="flex items-center gap-2"
                >
                  <X className="h-4 w-4" />
                  {t("removeFile")}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center">
                  {error ? (
                    <AlertCircle className="text-destructive h-12 w-12" />
                  ) : (
                    <Upload className="text-muted-foreground h-12 w-12" />
                  )}
                </div>
                <div className="space-y-2">
                  <h3 className="text-foreground text-lg font-medium">
                    {dragActive
                      ? t("dropTheFileHere")
                      : t("uploadAScratchProject")}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {t("dragAFileHereOrClickToChooseOne")}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {t("supportsSb3JsonAndCc3UpTo")}
                    {maxSize} MiB
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="bg-destructive/10 border-destructive/20 flex items-center gap-2 rounded-lg border p-3">
          <AlertCircle className="text-destructive h-4 w-4 flex-shrink-0" />
          <span className="text-destructive text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
