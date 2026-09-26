"use client";

import { useEffect, useState } from "react";
import Cropper, { type Area } from "react-easy-crop";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ImageCropDialog({
  file,
  kind,
  onSave,
  onClose,
}: {
  file: File;
  kind: "cover" | "avatar";
  onSave: (file: File) => void;
  onClose: () => void;
}) {
  const t = useTranslations("ui");
  const [url, setUrl] = useState("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [area, setArea] = useState<Area | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [valid, setValid] = useState(false);
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file);
    setUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);
  async function save() {
    if (!area || !valid || busy) return;
    setBusy(true);
    setError("");
    try {
      const image = new window.Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement("canvas");
      canvas.width = kind === "cover" ? 1200 : 256;
      canvas.height = kind === "cover" ? 900 : 256;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable");
      context.imageSmoothingQuality = "high";
      context.drawImage(
        image,
        area.x,
        area.y,
        area.width,
        area.height,
        0,
        0,
        canvas.width,
        canvas.height,
      );
      const blob = await new Promise<Blob>((resolve, reject) =>
        canvas.toBlob(
          (value) =>
            value ? resolve(value) : reject(new Error("Image encoding failed")),
          "image/png",
        ),
      );
      onSave(new File([blob], `${kind}.png`, { type: "image/png" }));
    } catch {
      setError(t("imageProcessingFailed"));
    } finally {
      setBusy(false);
    }
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent className="max-h-[95dvh] max-w-2xl overflow-y-auto data-[state=closed]:animate-none data-[state=open]:animate-none">
        <DialogHeader>
          <DialogTitle>
            {kind === "cover" ? t("cropCover") : t("cropAvatar")}
          </DialogTitle>
          <DialogDescription>{t("cropInstructions")}</DialogDescription>
        </DialogHeader>
        <div className="relative h-[min(50dvh,400px)] overflow-hidden rounded-lg bg-neutral-950">
          {url && (
            <Cropper
              image={url}
              crop={crop}
              zoom={zoom}
              aspect={kind === "cover" ? 4 / 3 : 1}
              cropShape={kind === "avatar" ? "round" : "rect"}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, pixels) => setArea(pixels)}
              onMediaLoaded={(media) => {
                const ok =
                  media.naturalWidth * media.naturalHeight <= 40_000_000;
                setValid(ok);
                if (!ok) setError(t("imageProcessingFailed"));
              }}
              mediaProps={{
                onError: () => {
                  setValid(false);
                  setError(t("imageProcessingFailed"));
                },
              }}
            />
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="crop-zoom">{t("imageZoom")}</Label>
          <input
            id="crop-zoom"
            type="range"
            min="1"
            max="3"
            step="0.01"
            value={zoom}
            onChange={(event) => setZoom(Number(event.target.value))}
            className="w-full accent-[hsl(var(--primary))]"
          />
        </div>
        <p className="text-muted-foreground text-xs">
          {t("imageOutputNotice", {
            size: kind === "cover" ? "1200 × 900" : "256 × 256",
          })}
        </p>
        {error && (
          <p role="alert" className="text-destructive text-sm">
            {error}
          </p>
        )}
        <div className="flex justify-end gap-3">
          <Button variant="outline" disabled={busy} onClick={onClose}>
            {t("cancelEditing")}
          </Button>
          <Button disabled={busy || !valid || !area} onClick={save}>
            {busy ? t("processingImage") : t("applyCrop")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
