"use client";

import Image from "next/image";
import { useState } from "react";
import { Globe } from "lucide-react";

export default function SiteIcon({ src }: { src: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className="flex h-4 w-4 shrink-0 items-center justify-center"
      aria-hidden="true"
    >
      {failed || !src ? (
        <Globe className="text-muted-foreground h-4 w-4" />
      ) : (
        <Image
          src={src}
          alt=""
          width={16}
          height={16}
          unoptimized
          onError={() => setFailed(true)}
          className="rounded-sm object-contain"
        />
      )}
    </div>
  );
}
