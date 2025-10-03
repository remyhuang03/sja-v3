import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModernNewsItem from "./NewsItem";

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
        <Card className="w-full">
            <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2">
                    <span className="text-xl font-bold">最新动态</span>
                    <Badge variant="secondary" className="text-xs">
                        {newsList.length} 条消息
                    </Badge>
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
                <div className="space-y-1">
                    {newsList.map((news, index) => (
                        <ModernNewsItem
                            key={news.article}
                            article={news.article}
                            title={news.title}
                            description={news.description}
                            thumbnail={news.thumbnail}
                            isFirst={index === 0}
                        />
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
