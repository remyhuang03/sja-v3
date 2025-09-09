import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Tag, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernVersionItemProps {
    version: string;
    date: string;
    update: (string | [string, string])[];
    isFirst?: boolean;
    isLast?: boolean;
}

const tagStyles = {
    new: "bg-yellow-500 text-yellow-50 hover:bg-yellow-600",
    added: "bg-green-500 text-green-50 hover:bg-green-600",
    improved: "bg-blue-500 text-blue-50 hover:bg-blue-600",
    fixed: "bg-blue-500 text-blue-50 hover:bg-blue-600",
    removed: "bg-red-500 text-red-50 hover:bg-red-600",
};

const tagOrder = {
    new: 1,
    added: 2,
    removed: 3,
    improved: 4,
    fixed: 5,
};

export default function ModernVersionItem({ 
    version, 
    date, 
    update, 
    isFirst = false, 
    isLast = false 
}: ModernVersionItemProps) {
    // Sort update items by tag priority
    const sortedUpdate = [...update].sort((a, b) => {
        const getTagOrder = (item: string | [string, string]) => {
            if (Array.isArray(item)) {
                return tagOrder[item[0] as keyof typeof tagOrder] || 99;
            }
            return 99; // String items go to the end
        };
        
        return getTagOrder(a) - getTagOrder(b);
    });
    const renderUpdateItem = (item: string | [string, string], index: number) => {
        if (Array.isArray(item)) {
            const [tag, description] = item;
            const tagClass = tagStyles[tag as keyof typeof tagStyles] || "bg-gray-500 text-gray-50";
            
            return (
                <li key={index} className="flex items-start gap-3">
                    <Badge className={cn("text-xs font-medium px-2 py-1 flex-shrink-0", tagClass)}>
                        {tag}
                    </Badge>
                    <span className="text-sm text-card-foreground leading-relaxed flex-1">
                        {description}
                    </span>
                </li>
            );
        } else {
            // Fallback for string items
            return (
                <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                    <span className="text-sm text-card-foreground leading-relaxed">
                        {item}
                    </span>
                </li>
            );
        }
    };

    return (
        <div className="relative">
            {/* Timeline line */}
            {!isLast && (
                <div className="absolute left-6 top-16 w-0.5 h-full bg-border -z-10" />
            )}
            
            <div className="flex gap-6">
                {/* Timeline dot */}
                <div className={cn(
                    "flex-shrink-0 w-12 h-12 rounded-full border-4 bg-background flex items-center justify-center",
                    isFirst 
                        ? "border-primary bg-primary/10" 
                        : "border-border bg-muted"
                )}>
                    {isFirst ? (
                        <Sparkles className="h-5 w-5 text-primary" />
                    ) : (
                        <Tag className="h-4 w-4 text-muted-foreground" />
                    )}
                </div>

                {/* Content */}
                <div className="flex-1">
                    <Card className={cn(
                        "transition-all duration-300 hover:shadow-md",
                        isFirst && "border-primary/20 bg-primary/5"
                    )}>
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <span className="text-lg font-bold">版本 {version}</span>
                                    {isFirst && (
                                        <Badge className="bg-primary/20 text-primary border-primary/30">
                                            最新
                                        </Badge>
                                    )}
                                </CardTitle>
                                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <CalendarDays className="h-4 w-4" />
                                    {date}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                            <ul className="space-y-3">
                                {sortedUpdate.map((item, index) => renderUpdateItem(item, index))}
                            </ul>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
