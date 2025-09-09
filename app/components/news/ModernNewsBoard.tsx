import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernNewsItem from "./ModernNewsItem";

import fs from 'fs'
import path from 'path'

export default function ModernNewsBoard() {
    function getNewsList() {
        const listPath = path.join(process.cwd(), 'data/news/news-info.json');
        const ret = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
        return ret;
    }

    const newsList = getNewsList();

    return (
        <Card className="h-fit">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">最新动态</CardTitle>
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                        {newsList.length} 条消息
                    </Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-0">
                <div className="space-y-3">
                    {newsList.map((news, index) => (
                        <ModernNewsItem
                            key={news.article}
                            article={news.article}
                            title={news.title}
                            description={news.description}
                            thumbnail={news.thumbnail}
                            isLast={index === newsList.length - 1}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
