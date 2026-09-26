import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import getNavItemById from "../util/db/getNavItemById";
import SiteIcon from "./SiteIcon";

interface NavItem {
  name: string;
  url: string;
  icon?: string; // Optional favicon URL.
  description?: string;
  tags?: string[];
}

interface ModernNavSectionProps {
  cate: string;
  items: number[];
}

const NavItemCard = ({ item }: { item: NavItem }) => {
  return (
    <Card className="group border-border/50 hover:border-primary/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <CardContent className="p-4">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="mb-2 flex items-center gap-2">
                <SiteIcon
                  src={item.icon}
                  alt={`${item.name} icon`}
                  websiteUrl={item.url}
                />
                <h3 className="text-card-foreground group-hover:text-primary truncate font-semibold transition-colors">
                  {item.name}
                </h3>
                <ExternalLink className="text-muted-foreground h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>

              {item.description && (
                <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                  {item.description}
                </p>
              )}

              {item.tags && item.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {item.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </a>
      </CardContent>
    </Card>
  );
};

export default function ModernNavSection({
  cate,
  items,
}: ModernNavSectionProps) {
  // no item for this cate, return empty
  if (!items || items.length === 0) {
    return null;
  }

  let navItems = getNavItemById(items);
  if (!Array.isArray(navItems)) {
    navItems = [navItems];
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h2 className="text-foreground text-2xl font-bold">{cate}</h2>
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {navItems.map((item, index) => (
          <NavItemCard
            key={index}
            item={{
              name: item[0],
              url: item[1],
              icon: item[2],
              description: "",
            }}
          />
        ))}
      </div>
    </div>
  );
}
