import Path from 'path';

import { readFile } from 'node:fs/promises';
import { notFound } from 'next/navigation';
import Markdown from '../components/layout/Markdown';
import NotFound from '../not-found';

export default async function Page({ searchParams }: { searchParams: Promise<{ a?: string }> }) {
    const articleName = (await searchParams).a;
    const validPattern = /^[a-zA-Z0-9-]+$/;

    if (!validPattern.test(articleName) || !articleName)
        return (<NotFound />);

    const MarkdownFile = await readFile(Path.join(process.cwd(), "data/news/md-articles", articleName + '.md'), 'utf8').catch(() => null);

    if (!MarkdownFile)
        return (<NotFound />);

    return (
        <div className='mb-10 mx-4 sm:mx-6'>
            <Markdown mdText={MarkdownFile} />
        </div>
    );
}