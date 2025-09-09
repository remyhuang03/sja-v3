import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink } from "lucide-react";
import getNavItemById from "../util/db/getNavItemById";
import SiteIcon from "./SiteIcon";

interface NavItem {
    name: string;
    url: string;
    icon: string;
    description?: string;
    tags?: string[];
}

interface ModernNavSectionProps {
    cate: string;
    items: number[];
}

// 自动获取网站图标的函数 - 使用中国友好的方式
const getFaviconUrl = (url: string): string => {
    try {
        const domain = new URL(url).hostname;
        // 优先使用网站的 favicon.ico
        return `https://${domain}/favicon.ico`;
    } catch {
        // 如果URL解析失败，返回一个默认的占位符
        return '/favicon.ico';
    }
};

const NavItemCard = ({ item }: { item: NavItem }) => {
    return (
        <Card className="group hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border-border/50 hover:border-primary/20">
            <CardContent className="p-4">
                <a 
                    href={item.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <SiteIcon 
                                    src={item.icon} 
                                    alt={`${item.name} icon`}
                                    websiteUrl={item.url}
                                />
                                <h3 className="font-semibold text-card-foreground group-hover:text-primary transition-colors truncate">
                                    {item.name}
                                </h3>
                                <ExternalLink className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                            
                            {item.description && (
                                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                                    {item.description}
                                </p>
                            )}
                            
                            {item.tags && item.tags.length > 0 && (
                                <div className="flex flex-wrap gap-1">
                                    {item.tags.map((tag, index) => (
                                        <Badge 
                                            key={index} 
                                            variant="secondary" 
                                            className="text-xs"
                                        >
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

export default function ModernNavSection({ cate, items }: ModernNavSectionProps) {
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
                <h2 className="text-2xl font-bold text-foreground">{cate}</h2>
                <Badge variant="outline" className="text-sm">
                    {navItems.length} 个网站
                </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-w-7xl mx-auto">
                {navItems.map((item, index) => (
                    <NavItemCard 
                        key={index} 
                        item={{
                            name: item[0],
                            url: item[1],
                            icon: item[2],
                            description: ""
                        }} 
                    />
                ))}
            </div>
        </div>
    );
}
