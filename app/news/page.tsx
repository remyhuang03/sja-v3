import Path from 'path';

import { readFile } from 'node:fs/promises';
import { notFound } from 'next/navigation';
import Markdown from '../components/layout/Markdown';
import NotFound from '../not-found';

export default async function Page({ searchParams }: { searchParams: Promise<{ a?: string }> }) {
    const articleName = (await searchParams).a;
    const validPattern = /^[a-zA-Z0-9-]+$/;

    if (!articleName || !validPattern.test(articleName))
        notFound();

    const MarkdownFile = await readFile(Path.join(process.cwd(), "data/news/md-articles", articleName + '.md'), 'utf8').catch(() => null);

    if (!MarkdownFile)
        notFound();

    return (
        <div className='mb-10 mx-4 sm:mx-6'>
            <Markdown mdText={MarkdownFile} />
        </div>
    );
}