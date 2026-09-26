import { ExternalLink } from "lucide-react";
import type { Website } from "@/lib/websites";
import SiteIcon from "./SiteIcon";

export default function NavSection({
  cate,
  items,
}: {
  cate: string;
  items: Website[];
}) {
  if (!items.length) return null;
  return (
    <section className="space-y-4">
      <h2 className="text-xl font-semibold">{cate}</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="group border-border bg-card hover:border-primary/50 focus-visible:outline-ring rounded-lg border px-4 py-5 transition-colors focus-visible:outline-2"
          >
            <div className="flex items-center gap-3">
              <SiteIcon key={item.icon_path} src={item.icon_path} />
              <h3 className="group-hover:text-primary min-w-0 flex-1 truncate text-sm font-medium">
                {item.name}
              </h3>
              <ExternalLink
                className="text-muted-foreground h-3 w-3"
                aria-hidden="true"
              />
            </div>
            {item.description && (
              <p className="text-muted-foreground mt-3 text-sm leading-6">
                {item.description}
              </p>
            )}
          </a>
        ))}
      </div>
    </section>
  );
}
