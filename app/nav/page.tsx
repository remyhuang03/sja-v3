import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Upload } from "lucide-react";
import ModernNavSection from "./ModernNavSection";
import fs from "fs";
import path from "path";

export default function Page() {
    // get cates file
    const cateFilePath = path.join(process.cwd(), 'data/nav/cates.json');
    const cates = JSON.parse(fs.readFileSync(cateFilePath, 'utf-8'));

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-2">SJA航站楼</h1>
                <p className="text-muted-foreground">发现优质的Scratch相关网站和资源</p>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mb-8">
                <Button asChild className="gap-2">
                    <a href="https://www.wenjuan.com/s/UZBZJvXfgl/" target="_blank" rel="noopener noreferrer">
                        <Upload className="h-4 w-4" />
                        提交更多网站
                        <ExternalLink className="h-3 w-3" />
                    </a>
                </Button>
            </div>

            {/* Categories */}
            <div className="space-y-8">
                {Object.keys(cates).map((cate) => (
                    <ModernNavSection 
                        key={cate} 
                        cate={cate} 
                        items={cates[cate].show} 
                    />
                ))}
            </div>
        </div>
    );
}