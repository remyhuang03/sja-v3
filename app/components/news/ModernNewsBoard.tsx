import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ModernNewsItem from "./ModernNewsItem";

import newsList from '@/data/news/news-info.json';

export default function ModernNewsBoard() {
    return (
        <Card className="h-fit">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">最新动态</CardTitle>
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
