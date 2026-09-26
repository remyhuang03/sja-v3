"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const t = useTranslations("ui");

  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="my-[40vh] text-center">
      <h1>404 Not Found</h1>
      <h2>{t("thisPageCouldNotBeFound")}</h2>
      <p>{t("returningToTheHomepageIn5Seconds")}</p>
    </div>
  );
}
