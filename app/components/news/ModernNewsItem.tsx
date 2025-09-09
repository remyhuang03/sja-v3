import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface ModernNewsItemProps {
    article: string;
    title: string;
    description: string;
    thumbnail?: string;
    isLast?: boolean;
}

export default function ModernNewsItem({ 
    article, 
    title, 
    description, 
    thumbnail, 
    isLast = false 
}: ModernNewsItemProps) {
    return (
        <div>
            <Link href={`/news?a=${article}`}>
                <article className="group p-3 rounded-lg transition-all duration-200 hover:bg-accent/50 hover:shadow-sm cursor-pointer">
                    <div className="flex items-start space-x-3">
                        {thumbnail && (
                            <div className="flex-shrink-0">
                                <div 
                                    className="w-12 h-12 rounded-md bg-muted bg-cover bg-center"
                                    style={{ backgroundImage: `url(${thumbnail})` }}
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-card-foreground group-hover:text-primary transition-colors line-clamp-1">
                                {title}
                            </h3>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                {description}
                            </p>
                        </div>
                    </div>
                </article>
            </Link>
            {!isLast && <Separator className="my-2" />}
        </div>
    );
}
