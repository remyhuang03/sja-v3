import Board from "../ui/Board";
import NewsItem from "./NewsBoard/NewsItem";

import fs from 'fs'
import path from 'path'

export default function NewsBoard() {
    function getNewsList() {
        const listPath = path.join(process.cwd(), 'data/news/news-info.json');
        const ret = JSON.parse(fs.readFileSync(listPath, 'utf-8'));
        return ret;
    }

    const newsList = getNewsList();

    return (
        <Board>
            <section>
                <ul>
                    {newsList.map(
                        (news) => {
                            return <NewsItem
                                key={news.article}
                                article={news.article}
                                title={news.title}
                                description={news.description}
                                thumbnail={news.thumbnail}
                            />
                        }
                    )}
                </ul>
            </section>
        </Board>
    );
}