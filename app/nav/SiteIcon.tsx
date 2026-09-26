'use client';

import Image from 'next/image';
import { useMemo, useState } from 'react';
import { Globe } from 'lucide-react';

interface SiteIconProps { src?: string; alt: string; websiteUrl: string }
export default function SiteIcon({ src, alt, websiteUrl }: SiteIconProps) {
  const urls = useMemo(() => {
    const candidates = src ? [src] : [];
    try { candidates.push(`${new URL(websiteUrl).origin}/favicon.ico`); } catch { /* Use fallback for invalid URLs. */ }
    return [...new Set(candidates)];
  }, [src, websiteUrl]);
  const [index, setIndex] = useState(0);
  return <div className="w-4 h-4 flex items-center justify-center shrink-0">
    {urls[index] ? <Image src={urls[index]} alt={alt} width={16} height={16} unoptimized loading="lazy" referrerPolicy="no-referrer" onError={() => setIndex(i => i + 1)} className="rounded-sm object-contain" /> : <Globe className="w-3 h-3 text-muted-foreground" aria-label={alt} />}
  </div>;
}
