import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import ProjectDisplay from "./ProjectDisplay";

export default function ModernFooter() {
  const t = useTranslations("ui");

  return (
    <footer className="border-border/40 mt-auto border-t bg-transparent">
      <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
        {/* Project Display Section */}
        <ProjectDisplay />

        <Separator className="my-8" />

        {/* Site Info */}
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-16">
          {/* About */}
          <div>
            <h4 className="mb-3 flex items-center gap-2 font-semibold">
              <Image
                src="/meta/main-logo.svg"
                alt="SJA"
                width={20}
                height={20}
              />
              {t("aboutSjaPlus")}
            </h4>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {t(
                "sjaPlusProvidesProjectAnalysisSimilarityComparisonAndResources",
              )}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="mb-3 font-semibold">{t("quickLinks")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/analyze"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("projectAnalyzer")}
                </Link>
              </li>
              <li>
                <Link
                  href="/nav"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("resources")}
                </Link>
              </li>
              <li>
                <Link
                  href="/update-log"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("changelog")}
                </Link>
              </li>
              <li>
                <a
                  href="https://note.youdao.com/s/80ZZTzYW"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
                >
                  {t("faq")}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="mb-3 font-semibold">{t("legal")}</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/project-display-review"
                  className="text-muted-foreground hover:text-primary text-sm"
                >
                  {t("adminReview")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/privacy"
                  className="text-muted-foreground hover:text-primary inline-flex items-center gap-1 text-sm transition-colors"
                >
                  {t("privacyPolicy")}
                </Link>
              </li>
              <li>
                <Link
                  href="/legal/contract"
                  className="text-muted-foreground hover:text-primary text-sm transition-colors"
                >
                  {t("termsOfService")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Copyright */}
        <div className="text-center text-xs">
          <p>
            Copyright &copy; 2024–2026 SJA Plus. Made with ❤️ for the Scratch
            community.
          </p>
        </div>
      </div>
    </footer>
  );
}
