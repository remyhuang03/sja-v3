"use client";

import { useCallback } from "react";
import { useTranslations } from "next-intl";

/** Same-origin requests with localized transport errors; infrastructure routes /api to Go. */
export function useRequestJSON() {
  const t = useTranslations("ui");
  return useCallback(
    async function requestJSON<T>(
      path: string,
      init?: RequestInit,
    ): Promise<T> {
      let response: Response;
      try {
        response = await fetch(path, {
          ...init,
          signal: init?.signal ?? AbortSignal.timeout(120_000),
        });
      } catch {
        throw new Error(t("networkRequestFailed"));
      }
      const data = await response.json().catch(() => null);
      if (!response.ok || data === null) {
        throw new Error(
          data?.message ||
            data?.msg ||
            t("httpRequestFailed", { status: response.status }),
        );
      }
      return data as T;
    },
    [t],
  );
}
