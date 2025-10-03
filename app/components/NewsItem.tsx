import Link from 'next/link';
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ModernNewsItemProps {
    article: string;
    title: string;
    description: string;
    thumbnail?: string;
    isFirst?: boolean;
}

export default function ModernNewsItem({ 
    article, 
    title, 
    description, 
    thumbnail, 
    isFirst = false 
}: ModernNewsItemProps) {
    const isExternal = article.startsWith('http');
    
    return (
        <div className={cn(
            "group relative rounded-lg border border-border/50 bg-card/50 p-4 transition-all hover:border-border hover:bg-card/80 hover:shadow-md",
            isFirst && "bg-primary/5 border-primary/20"
        )}>
            <div className="flex items-start gap-3">
                {thumbnail && (
                    <div className="flex-shrink-0">
                        <div 
                            className="w-12 h-12 rounded-md bg-muted bg-cover bg-center"
                            style={{ backgroundImage: `url(${thumbnail})` }}
                        />
                    </div>
                )}
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <h3 className="font-semibold text-sm text-card-foreground group-hover:text-primary transition-colors leading-tight">
                            {isExternal ? (
                                <a 
                                    href={article} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="hover:underline"
                                >
                                    {title}
                                </a>
                            ) : (
                                <Link href={`/news/${article}`} className="hover:underline">
                                    {title}
                                </Link>
                            )}
                        </h3>
                        
                        {isFirst && (
                            <Badge variant="default" className="text-xs px-2 py-1 bg-primary/20 text-primary-foreground">
                                最新
                            </Badge>
                        )}
                        
                        {isExternal && (
                            <Badge variant="outline" className="text-xs">
                                外链
                            </Badge>
                        )}
                    </div>
                    
                    <p className="text-xs text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
                        {description}
                    </p>
                </div>
            </div>
        </div>
    );
}
