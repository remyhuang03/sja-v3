"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import ThemeSwitcher from "../ThemeSwitcher";
import LanguageSwitcher from "../LanguageSwitcher";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { logoFont } from "@/app/fonts/logoFont";
import { cn } from "@/lib/utils";

export default function Header() {
  const t = useTranslations("ui");

  const pathname = usePathname();

  const navLinks = [
    {
      name: t("projectAnalyzer"),
      href: "/analyze",
    },
    {
      name: t("similarity"),
      href: "/compare",
      disabled: false,
    },
    {
      name: t("resources"),
      href: "/nav",
    },
  ];

  const isActiveRoute = (href: string) => {
    if (href === "/") {
      return pathname === "/";
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="border-border/40 bg-background/95 supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 w-full border-b backdrop-blur">
      <div className="mx-auto flex min-h-20 max-w-6xl flex-wrap items-center gap-y-2 px-6 py-3 sm:px-10">
        {/* Logo */}
        <div
          className={cn(
            "mr-3 flex items-center space-x-2 sm:mr-6",
            logoFont.className,
          )}
        >
          <Link href="/" className="flex items-center space-x-2">
            <Image
              width={98}
              height={19}
              src="/meta/white-banner-title.svg"
              alt="SJA Plus"
              className="h-5 w-auto invert dark:invert-0"
            />
          </Link>
        </div>

        {/* Navigation */}
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            {navLinks.map((navLink) => {
              const isActive = !navLink.disabled && isActiveRoute(navLink.href);

              return (
                <NavigationMenuItem key={navLink.name}>
                  <NavigationMenuLink asChild>
                    {navLink.disabled ? (
                      <span
                        className={cn(
                          "group inline-flex h-10 w-max cursor-not-allowed items-center justify-center rounded-md px-4 py-2 text-sm font-medium opacity-50 transition-colors",
                        )}
                      >
                        {navLink.name}
                        <span className="text-muted-foreground ml-1 text-xs">
                          {t("comingSoon2")}
                        </span>
                      </span>
                    ) : (
                      <Link
                        href={navLink.href}
                        className={cn(
                          "group hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground relative inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-all duration-200 focus:outline-none disabled:pointer-events-none disabled:opacity-50",
                          isActive && "text-primary bg-accent/50",
                        )}
                      >
                        {navLink.name}
                        {isActive && (
                          <div className="bg-primary absolute -bottom-1 left-1/2 h-0.5 w-6 -translate-x-1/2 rounded-full transition-all duration-200" />
                        )}
                      </Link>
                    )}
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          <ThemeSwitcher />
          <LanguageSwitcher />
        </div>

        {/* Mobile Navigation Button */}
        <div className="border-border/50 flex w-full items-center justify-center border-t pt-1 md:hidden">
          <nav
            aria-label={t("mobileNavigation")}
            className="flex gap-3 text-xs"
          >
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "py-2",
                  isActiveRoute(link.href) && "text-primary",
                )}
              >
                {link.name
                  .replace(t("projectAnalyzer"), t("analyze"))
                  .replace(t("similarity"), t("compare"))}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}
