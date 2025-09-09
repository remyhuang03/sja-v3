import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Plus } from "lucide-react";
import ModernNavSection from "./ModernNavSection";
import fs from "fs";
import Path from "path";

export default function ModernNavPage() {
    // get cates file
    const cateFilePath = Path.join(process.cwd(), 'data/nav/cates.json');
    const cates = JSON.parse(fs.readFileSync(cateFilePath, 'utf-8'));

    const totalSites = Object.values(cates).reduce((acc: number, cate: any) => {
        return acc + (cate.show?.length || 0);
    }, 0);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">SJA航站楼</h1>
                <p className="text-muted-foreground mb-4">
                    发现优质的Scratch相关网站和资源
                </p>
                <div className="flex items-center justify-center gap-4">
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {Object.keys(cates).length} 个分类
                    </Badge>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {totalSites} 个网站
                    </Badge>
                </div>
            </div>

            {/* Submit button */}
            <div className="flex justify-center mb-8">
                <Button asChild className="gap-2">
                    <a href="https://www.wenjuan.com/s/UZBZJvXfgl/" target="_blank" rel="noopener noreferrer">
                        <Plus className="h-4 w-4" />
                        提交更多网站
                        <ExternalLink className="h-4 w-4" />
                    </a>
                </Button>
            </div>

            {/* Categories */}
            <div className="space-y-8">
                {Object.keys(cates).map((cate) => (
                    <ModernNavSection 
                        key={cate} 
                        cate={cate} 
                        items={cates[cate].show || []} 
                    />
                ))}
            </div>
        </div>
    );
}
