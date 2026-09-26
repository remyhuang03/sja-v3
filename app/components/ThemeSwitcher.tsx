"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations("ui");
  useEffect(() => setMounted(true), []);
  const dark = !mounted || theme === "dark";
  const label = dark ? t("switchToLightTheme") : t("switchToDarkTheme");
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled={!mounted}
      aria-label={label}
      title={label}
      onClick={() => setTheme(dark ? "light" : "dark")}
    >
      {dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
