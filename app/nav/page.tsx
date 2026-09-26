import { useTranslations } from "next-intl";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import ResourceDirectory from "./ResourceDirectory";

export default function Page() {
  const t = useTranslations("ui");
  return (
    <div className="mx-auto max-w-6xl px-6 py-12 sm:px-10">
      <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("sjaResources")}
          </h1>
          <p className="text-muted-foreground mt-3">
            {t("discoverScratchWebsitesAndResources")}
          </p>
        </div>
        <Button asChild>
          <Link href="/nav/submit">
            <Plus aria-hidden="true" />
            {t("suggestAWebsite")}
          </Link>
        </Button>
      </div>
      <ResourceDirectory />
    </div>
  );
}
